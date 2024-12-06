package handlers

import (
	"backend/models"
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

func CreateService(c *gin.Context) {
	permissions, _ := c.Get("permissions")

	if !hasPermission(permissions, "write:services") {
		c.JSON(http.StatusForbidden, gin.H{"error": "You do not have permission to create a service"})
		return
	}

	orgID, exists := c.Get("orgID")
	if !exists {
		c.JSON(http.StatusForbidden, gin.H{"error": "You do not have permission to create a service"})
		return
	}
	var service models.Service
	if err := c.ShouldBindJSON(&service); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Ensure service is created for the correct organization
	service.OrganizationID = orgID.(string)

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

	orgID, exists := c.Get("orgID")
	if !exists {
		c.JSON(http.StatusForbidden, gin.H{"error": "You do not have permission to create a service"})
		return
	}
	var services []models.Service
	if err := models.DB.Where("organization_id = ?", orgID).Find(&services).Error; err != nil {
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

	orgID, exists := c.Get("orgID")
	if !exists {
		c.JSON(http.StatusForbidden, gin.H{"error": "You do not have permission to create a service"})
		return
	}
	id := c.Param("id")
	var service models.Service
	if err := models.DB.Where("id = ? AND organization_id = ?", id, orgID).First(&service).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Service not found"})
		return
	}
	c.JSON(http.StatusOK, service)
}

func UpdateService(c *gin.Context) {
	var req map[string]interface{} // Use a map to handle partial updates

	permissions, _ := c.Get("permissions")
	if !hasPermission(permissions, "write:services") {
		c.JSON(http.StatusForbidden, gin.H{"error": "You do not have permission to update this service"})
		return
	}

	orgID, exists := c.Get("orgID")
	if !exists {
		c.JSON(http.StatusForbidden, gin.H{"error": "You do not have permission to update this service"})
		return
	}

	serviceID := c.Param("id") // Service ID from the route

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	// Ensure orgID and serviceID match
	var service models.Service
	if err := models.DB.Where("id = ? AND organization_id = ?", serviceID, orgID).First(&service).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Service not found"})
		return
	}

	// Preserve previous status for incident handling
	previousStatus := service.Status

	// Update only the fields provided in req
	if err := models.DB.Model(&service).Updates(req).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update service"})
		return
	}

	// Handle incidents based on status change (if status was updated)
	if status, ok := req["status"].(string); ok {
		if shouldCreateIncident(previousStatus, status) {
			newID, _ := GenerateRandomHashID(16)
			incident := models.Incident{
				ID:          newID,
				Title:       "Service Issue Detected",
				Description: fmt.Sprintf("The %s has entered a degraded or outage state.", service.Name),
				Status:      "active",
				Priority:    getIncidentPriority(status),
				ServiceID:   service.ID,
				CreatedAt:   time.Now(),
			}
			if err := models.DB.Create(&incident).Error; err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create incident"})
				return
			}
		} else if shouldResolveIncident(previousStatus, status) {
			var activeIncident models.Incident
			if err := models.DB.Where("service_id = ? AND status = ?", service.ID, "active").First(&activeIncident).Error; err == nil {
				if err := models.DB.Model(&activeIncident).
					Updates(map[string]interface{}{
						"status":      "resolved",
						"resolved_at": timePtr(time.Now()),
					}).Error; err != nil {
					c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to resolve incident"})
					return
				}
			}
		}
	}

	message := fmt.Sprintf("%s status changed to %s", service.Name, service.Status)
	BroadcastUpdate(message)
	c.JSON(http.StatusOK, service)
}

// Helper functions to determine incident logic
func shouldCreateIncident(previousStatus, newStatus string) bool {
	return previousStatus == "operational" &&
		(newStatus == "degraded" || newStatus == "partial_outage" || newStatus == "major_outage")
}

func shouldResolveIncident(previousStatus, newStatus string) bool {
	return (previousStatus == "degraded" || previousStatus == "partial_outage" || previousStatus == "major_outage") &&
		newStatus == "operational"
}

// Helper function to determine priority based on the service status
func getIncidentPriority(status string) string {
	switch status {
	case "degraded":
		return "medium"
	case "partial_outage":
		return "high"
	case "major_outage":
		return "critical"
	default:
		return "low" // Default to low if operational or other status
	}
}

func timePtr(t time.Time) *time.Time {
	return &t
}
func DeleteService(c *gin.Context) {
	permissions, _ := c.Get("permissions")
	if !hasPermission(permissions, "write:services") {
		c.JSON(http.StatusForbidden, gin.H{"error": "You do not have permission to delete this service"})
		return
	}

	orgID, exists := c.Get("orgID")
	if !exists {
		c.JSON(http.StatusForbidden, gin.H{"error": "You do not have permission to create a service"})
		return
	}
	id := c.Param("id")
	if err := models.DB.Where("id = ? AND organization_id = ?", id, orgID).Delete(&models.Service{}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Service deleted"})
}
