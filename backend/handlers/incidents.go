package handlers

import (
	"backend/models"
	"net/http"
	"sort"

	"github.com/gin-gonic/gin"
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
	if err := models.DB.First(&incident, id).Error; err != nil {
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
	if err := models.DB.First(&incident, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Incident not found"})
		return
	}
	if err := c.ShouldBindJSON(&incident); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
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
	if err := models.DB.Delete(&models.Incident{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Incident deleted"})
}
