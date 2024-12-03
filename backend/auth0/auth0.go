package auth0

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/go-resty/resty/v2"
)

type Auth0Client struct {
	Domain       string
	ClientID     string
	ClientSecret string
	Token        string
	HTTPClient   *resty.Client
}

// Initialize a new Auth0 client
func NewAuth0Client(domain, clientID, clientSecret string) *Auth0Client {
	client := &Auth0Client{
		Domain:       domain,
		ClientID:     clientID,
		ClientSecret: clientSecret,
		HTTPClient:   resty.New().SetTimeout(10 * time.Second),
	}
	client.getToken()
	return client
}

// Function to initialize the Auth0Client
func InitAuth0Client() *Auth0Client {
	// Read Auth0 credentials from environment variables
	domain := os.Getenv("AUTH0_DOMAIN")
	clientID := os.Getenv("AUTH0_CLIENT_ID")
	clientSecret := os.Getenv("AUTH0_CLIENT_SECRET")

	// Check if all required variables are set
	if domain == "" || clientID == "" || clientSecret == "" {
		log.Fatalf("Auth0 environment variables are not set. Ensure AUTH0_DOMAIN, AUTH0_CLIENT_ID, and AUTH0_CLIENT_SECRET are defined.")
	}

	// Initialize and return the Auth0Client
	return NewAuth0Client(domain, clientID, clientSecret)
}

// Fetch Management API Token
func (c *Auth0Client) getToken() error {
	resp, err := c.HTTPClient.R().
		SetHeader("Content-Type", "application/json").
		SetBody(map[string]string{
			"client_id":     c.ClientID,
			"client_secret": c.ClientSecret,
			"audience":      fmt.Sprintf("https://%s/api/v2/", c.Domain),
			"grant_type":    "client_credentials",
		}).
		Post(fmt.Sprintf("https://%s/oauth/token", c.Domain))

	if err != nil {
		return err
	}

	if resp.StatusCode() != http.StatusOK {
		return fmt.Errorf("failed to get token: %s", resp.String())
	}

	var result map[string]interface{}
	if err := json.Unmarshal(resp.Body(), &result); err != nil {
		return err
	}

	c.Token = result["access_token"].(string)
	return nil
}

// Fetch Users in an Organization
func (c *Auth0Client) GetUsersByOrganization(orgID string) ([]map[string]interface{}, error) {
	resp, err := c.HTTPClient.R().
		SetAuthToken(c.Token).
		Get(fmt.Sprintf("https://%s/api/v2/organizations/%s/members", c.Domain, orgID))

	if err != nil {
		return nil, err
	}

	if resp.StatusCode() != http.StatusOK {
		return nil, fmt.Errorf("failed to fetch users: %s", resp.String())
	}

	var users []map[string]interface{}
	if err := json.Unmarshal(resp.Body(), &users); err != nil {
		return nil, err
	}

	return users, nil
}

// Assign a Role to a User
func (c *Auth0Client) AssignRoleToUser(userID, roleID string) error {
	body := map[string]interface{}{
		"roles": []string{roleID},
	}

	resp, err := c.HTTPClient.R().
		SetAuthToken(c.Token).
		SetHeader("Content-Type", "application/json").
		SetBody(body).
		Post(fmt.Sprintf("https://%s/api/v2/users/%s/roles", c.Domain, userID))

	if err != nil {
		return err
	}

	if resp.StatusCode() != http.StatusNoContent {
		return fmt.Errorf("failed to assign role: %s", resp.String())
	}

	return nil
}
