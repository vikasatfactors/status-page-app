package handlers

import (
	"backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

// Helper function to get organization ID from context (or from JWT)
func getOrgIDFromContext(c *gin.Context) string {
	// Example: extracting org_id from the context (can be passed via JWT claims or session)
	orgID, exists := c.Get("org_id")
	if !exists {
		return "" // You may want to return an error or handle it differently
	}
	return orgID.(string)
}

func CreateService(c *gin.Context) {
	permissions, _ := c.Get("permissions")
	if !hasPermission(permissions, "write:services") {
		c.JSON(http.StatusForbidden, gin.H{"error": "You do not have permission to create a service"})
		return
	}

	orgID := getOrgIDFromContext(c)
	if orgID == "" {
		c.JSON(http.StatusForbidden, gin.H{"error": "You do not have permission to create a service"})
	}
	var service models.Service
	if err := c.ShouldBindJSON(&service); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Ensure service is created for the correct organization
	service.OrganizationID = orgID

	if err := models.DB.Create(&service).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, service)
}

func GetServices(c *gin.Context) {
	permissions, _ := c.Get("permissions")
	if !hasPermission(permissions, "read:services") {
		c.JSON(http.StatusForbidden, gin.H{"error": "You do not have permission to view services"})
		return
	}

	orgID := getOrgIDFromContext(c)
	if orgID == "" {
		c.JSON(http.StatusForbidden, gin.H{"error": "You do not have permission to create a service"})
	}
	var services []models.Service
	if err := models.DB.Where("org_id = ?", orgID).Find(&services).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, services)
}

func GetService(c *gin.Context) {
	permissions, _ := c.Get("permissions")
	if !hasPermission(permissions, "read:services") {
		c.JSON(http.StatusForbidden, gin.H{"error": "You do not have permission to view this service"})
		return
	}

	orgID := getOrgIDFromContext(c)
	if orgID == "" {
		c.JSON(http.StatusForbidden, gin.H{"error": "You do not have permission to create a service"})
	}
	id := c.Param("id")
	var service models.Service
	if err := models.DB.Where("id = ? AND org_id = ?", id, orgID).First(&service).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Service not found"})
		return
	}
	c.JSON(http.StatusOK, service)
}

func UpdateService(c *gin.Context) {
	permissions, _ := c.Get("permissions")
	if !hasPermission(permissions, "write:services") {
		c.JSON(http.StatusForbidden, gin.H{"error": "You do not have permission to update this service"})
		return
	}

	orgID := getOrgIDFromContext(c)
	if orgID == "" {
		c.JSON(http.StatusForbidden, gin.H{"error": "You do not have permission to create a service"})
	}
	id := c.Param("id")
	var service models.Service
	if err := models.DB.Where("id = ? AND org_id = ?", id, orgID).First(&service).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Service not found"})
		return
	}

	var request struct {
		Status string `json:"status"`
	}
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Update service status
	service.Status = request.Status
	if err := models.DB.Save(&service).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, service)
}

func DeleteService(c *gin.Context) {
	permissions, _ := c.Get("permissions")
	if !hasPermission(permissions, "write:services") {
		c.JSON(http.StatusForbidden, gin.H{"error": "You do not have permission to delete this service"})
		return
	}

	orgID := getOrgIDFromContext(c)
	if orgID == "" {
		c.JSON(http.StatusForbidden, gin.H{"error": "You do not have permission to create a service"})
	}
	id := c.Param("id")
	if err := models.DB.Where("id = ? AND org_id = ?", id, orgID).Delete(&models.Service{}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Service deleted"})
}
