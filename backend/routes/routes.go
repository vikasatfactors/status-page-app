package routes

import (
	"backend/handlers"
	"backend/middleware"

	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()
	// Apply CORS middleware to all routes
	r.Use(middleware.CORSConfig())

	// Apply authentication middleware
	r.Use(middleware.Auth0Middleware())

	r.GET("/users", handlers.FetchUsers)
	r.PATCH("/users/:id/roles", handlers.UpdateUserRole)

	// Team routes
	r.POST("/teams", handlers.CreateTeam)
	r.GET("/teams", handlers.GetTeams)
	r.GET("/teams/:id", handlers.GetTeam)
	r.PUT("/teams/:id", handlers.UpdateTeam)
	r.DELETE("/teams/:id", handlers.DeleteTeam)
	r.POST("/teams/:id/members", handlers.AddUserToTeam)

	// Organization routes
	r.POST("/organizations", handlers.CreateOrganization)
	r.GET("/organizations", handlers.GetOrganizations)
	r.GET("/organizations/:id", handlers.GetOrganization)
	r.PUT("/organizations/:id", handlers.UpdateOrganization)
	r.DELETE("/organizations/:id", handlers.DeleteOrganization)

	// Service routes
	r.POST("/services", handlers.CreateService)
	r.GET("/services", handlers.GetServices)
	r.GET("/services/:id", handlers.GetService)
	r.PUT("/services/:id", handlers.UpdateService)
	r.DELETE("/services/:id", handlers.DeleteService)

	// Incident routes
	r.POST("/incidents", handlers.CreateIncident)
	r.GET("/incidents", handlers.GetIncidents)
	r.GET("/incidents/:id", handlers.GetIncident)
	r.PUT("/incidents/:id", handlers.UpdateIncident)
	r.DELETE("/incidents/:id", handlers.DeleteIncident)

	// WebSocket status updates
	r.GET("/status-updates", handlers.StatusUpdates)

	// Public status page
	r.GET("/status", handlers.PublicStatus)

	return r
}
