package middleware

import (
	"backend/config"
	"context"
	"errors"
	"fmt"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/labstack/gommon/log"
	"github.com/lestrrat-go/jwx/jwk"
)

var auth0Domain string
var auth0Audience string

func Init() {
	auth0Domain = config.GetEnv("AUTH0_DOMAIN")
	auth0Audience = config.GetEnv("AUTH0_AUDIENCE")
}

// Auth0Middleware validates Auth0-issued JWTs
func Auth0Middleware() gin.HandlerFunc {
	Init()
	return func(c *gin.Context) {
		// First, try to get the token from the Authorization header
		authHeader := c.GetHeader("Authorization")
		var tokenString string
		if authHeader != "" {
			// Extract token from "Bearer <token>"
			tokenString = strings.TrimPrefix(authHeader, "Bearer ")
		} else {
			// If no Authorization header, check the query parameters for the token
			tokenString = c.DefaultQuery("token", "")
		}

		// If no token is found, return Unauthorized error
		if tokenString == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization token is required"})
			c.Abort()
			return
		}

		// Validate the token
		claims, err := validateToken(tokenString)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
			c.Abort()
			return
		}

		// Add claims to context
		log.Info(claims)
		c.Set("userID", claims["sub"])
		c.Set("roles", claims["https://mystatuspageapp.com/roles"])
		c.Set("ordID", claims["org_id"])
		c.Set("permissions", claims["permissions"])
		c.Next()
	}
}

// validateToken validates a JWT against the Auth0 domain and audience
func validateToken(tokenString string) (jwt.MapClaims, error) {
	keyFunc := func(token *jwt.Token) (interface{}, error) {
		// Validate signing method
		if _, ok := token.Method.(*jwt.SigningMethodRSA); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}

		// Fetch the JWKS (JSON Web Key Set) from Auth0
		jwksURL := fmt.Sprintf("https://%s/.well-known/jwks.json", auth0Domain)
		return fetchKeyFromJWKS(jwksURL, token)
	}

	token, err := jwt.Parse(tokenString, keyFunc)
	if err != nil {
		return nil, err
	}

	// Verify claims
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		// Check audience: if aud is an array, check if auth0Audience is in the array
		audiences, ok := claims["aud"].([]interface{})
		if ok {
			// Iterate through the array and check if the required audience is present
			found := false
			for _, audience := range audiences {
				if audience == auth0Audience {
					found = true
					break
				}
			}
			if !found {
				return nil, errors.New("invalid audience")
			}
		} else if claims["aud"] != auth0Audience {
			// If aud is a single value, check it directly
			return nil, errors.New("invalid audience")
		}

		// Verify the issuer
		if claims["iss"] != fmt.Sprintf("https://%s/", auth0Domain) {
			return nil, errors.New("invalid issuer")
		}

		// Verify organization ID (org_id) claim
		_, ok = claims["org_id"]
		if !ok {
			return nil, errors.New("invalid organization ID")
		}

		return claims, nil
	}
	return nil, errors.New("invalid token")
}

func RBACMiddleware(requiredRole string) gin.HandlerFunc {
	return func(c *gin.Context) {
		role, exists := c.Get("role")
		if !exists || role != requiredRole {
			c.JSON(http.StatusForbidden, gin.H{"error": "Insufficient permissions"})
			c.Abort()
			return
		}
		c.Next()
	}
}

func fetchKeyFromJWKS(jwksURL string, token *jwt.Token) (interface{}, error) {
	// Create a context for the JWKS request
	ctx := context.Background()

	// Fetch the JWKS (JSON Web Key Set) from the provided URL
	set, err := jwk.Fetch(ctx, jwksURL)
	if err != nil {
		return nil, fmt.Errorf("could not fetch JWKS: %v", err)
	}

	// Extract the 'kid' from the JWT token header to find the correct key
	kid, ok := token.Header["kid"].(string)
	if !ok {
		return nil, fmt.Errorf("missing 'kid' in token header")
	}

	// Find the key by its 'kid'
	key, ok := set.LookupKeyID(kid)
	if !ok {
		return nil, fmt.Errorf("key not found in JWKS for kid: %s", kid)
	}

	// Return the key as an interface for use in token verification
	var keyInterface interface{}
	if err := key.Raw(&keyInterface); err != nil {
		return nil, fmt.Errorf("could not extract key: %v", err)
	}

	return keyInterface, nil
}
