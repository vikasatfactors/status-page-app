package handlers

import (
	"backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func PublicStatus(c *gin.Context) {
	var services []models.Service
	if err := models.DB.Find(&services).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var incidents []models.Incident
	if err := models.DB.Find(&incidents).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	statusPage := gin.H{
		"services":  services,
		"incidents": incidents,
	}
	c.JSON(http.StatusOK, statusPage)
}
