package handlers

import (
	"backend/models"
	"errors"
	"net/http"
	"sort"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func CreateIncident(c *gin.Context) {
	permissions, _ := c.Get("permissions")
	if !hasPermission(permissions, "write:incidents") {
		c.JSON(http.StatusForbidden, gin.H{"error": "You do not have permission to create an incident"})
		return
	}

	var incident models.Incident
	if err := c.ShouldBindJSON(&incident); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := models.DB.Create(&incident).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, incident)
}

func GetIncidents(c *gin.Context) {
	permissions, _ := c.Get("permissions")
	if !hasPermission(permissions, "read:incidents") {
		c.JSON(http.StatusForbidden, gin.H{"error": "You do not have permission to view incidents"})
		return
	}

	var incidents []models.Incident
	if err := models.DB.Find(&incidents).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	sort.Slice(incidents, func(i, j int) bool {
		return incidents[i].CreatedAt.After(incidents[j].CreatedAt)
	})
	c.JSON(http.StatusOK, incidents)
}

func GetIncident(c *gin.Context) {
	permissions, _ := c.Get("permissions")
	if !hasPermission(permissions, "read:incidents") {
		c.JSON(http.StatusForbidden, gin.H{"error": "You do not have permission to view this incident"})
		return
	}

	id := c.Param("id")
	var incident models.Incident
	if err := models.DB.First(&incident, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Incident not found"})
		return
	}
	c.JSON(http.StatusOK, incident)
}

func UpdateIncident(c *gin.Context) {
	permissions, _ := c.Get("permissions")
	if !hasPermission(permissions, "write:incidents") {
		c.JSON(http.StatusForbidden, gin.H{"error": "You do not have permission to update this incident"})
		return
	}

	id := c.Param("id")
	var incident models.Incident
	// Fix: Specify the query condition for fetching the incident
	if err := models.DB.First(&incident, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Incident not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		}
		return
	}

	if err := c.ShouldBindJSON(&incident); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Ensure that the `id` is not accidentally overwritten
	incident.ID = id

	if err := models.DB.Save(&incident).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, incident)
}

func DeleteIncident(c *gin.Context) {
	permissions, _ := c.Get("permissions")
	if !hasPermission(permissions, "write:incidents") {
		c.JSON(http.StatusForbidden, gin.H{"error": "You do not have permission to delete this incident"})
		return
	}

	id := c.Param("id")
	if err := models.DB.Delete(&models.Incident{}, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Incident deleted"})
}
