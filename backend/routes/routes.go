package routes

import (
	"backend/handlers"
	"backend/middleware"

	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()

	r.Use(middleware.CORSConfig())

	// Public status page route without authentication middleware
	r.GET("/status", handlers.PublicStatus)

	protected := r.Group("/")
	protected.Use(middleware.Auth0Middleware())

	// User routes
	protected.GET("/users", handlers.FetchUsers)
	protected.PATCH("/users/:id/roles", handlers.UpdateUserRole)

	// Team routes
	protected.POST("/teams", handlers.CreateTeam)
	protected.GET("/teams", handlers.GetTeams)
	protected.GET("/teams/:id", handlers.GetTeam)
	protected.PUT("/teams/:id", handlers.UpdateTeam)
	protected.DELETE("/teams/:id", handlers.DeleteTeam)
	protected.POST("/teams/:id/members", handlers.AddUserToTeam)

	// Organization routes
	protected.POST("/organizations", handlers.CreateOrganization)
	protected.GET("/organizations", handlers.GetOrganizations)
	protected.GET("/organizations/:id", handlers.GetOrganization)
	protected.PUT("/organizations/:id", handlers.UpdateOrganization)
	protected.DELETE("/organizations/:id", handlers.DeleteOrganization)

	// Service routes
	protected.POST("/services", handlers.CreateService)
	protected.GET("/services", handlers.GetServices)
	protected.GET("/services/:id", handlers.GetService)
	protected.PUT("/services/:id", handlers.UpdateService)
	protected.DELETE("/services/:id", handlers.DeleteService)

	// Incident routes
	protected.POST("/incidents", handlers.CreateIncident)
	protected.GET("/incidents", handlers.GetIncidents)
	protected.GET("/incidents/:id", handlers.GetIncident)
	protected.PUT("/incidents/:id", handlers.UpdateIncident)
	protected.DELETE("/incidents/:id", handlers.DeleteIncident)

	// WebSocket status updates
	protected.GET("/status-updates", handlers.StatusUpdates)

	return r
}
