package handlers

import (
	"backend/models"

	"github.com/gin-gonic/gin"
)

func FetchUsers(c *gin.Context) {
	orgID := c.Query("organization_id")
	users, err := models.Auth0Client.GetUsersByOrganization(orgID)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, users)
}

func UpdateUserRole(c *gin.Context) {
	userID := c.Param("id")
	var payload struct {
		Role string `json:"role"`
	}
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(400, gin.H{"error": "Invalid payload"})
		return
	}

	err := models.Auth0Client.AssignRoleToUser(userID, payload.Role)
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, gin.H{"message": "Role updated successfully"})
}
