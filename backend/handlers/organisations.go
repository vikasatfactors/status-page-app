package handlers

import (
	"backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func CreateOrganization(c *gin.Context) {
	permissions, _ := c.Get("permissions")
	if !hasPermission(permissions, "write:organization") {
		c.JSON(http.StatusForbidden, gin.H{"error": "You do not have permission to create an organization"})
		return
	}

	var organization models.Organization
	if err := c.ShouldBindJSON(&organization); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := models.DB.Create(&organization).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, organization)
}

func GetOrganizations(c *gin.Context) {
	permissions, _ := c.Get("permissions")
	if !hasPermission(permissions, "read:organization") {
		c.JSON(http.StatusForbidden, gin.H{"error": "You do not have permission to view organizations"})
		return
	}

	var organizations []models.Organization
	if err := models.DB.Find(&organizations).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, organizations)
}

func GetOrganization(c *gin.Context) {
	permissions, _ := c.Get("permissions")
	if !hasPermission(permissions, "read:organization") {
		c.JSON(http.StatusForbidden, gin.H{"error": "You do not have permission to view this organization"})
		return
	}

	id := c.Param("id")
	var organization models.Organization
	if err := models.DB.First(&organization, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Organization not found"})
		return
	}
	c.JSON(http.StatusOK, organization)
}

func UpdateOrganization(c *gin.Context) {
	permissions, _ := c.Get("permissions")
	if !hasPermission(permissions, "write:organization") {
		c.JSON(http.StatusForbidden, gin.H{"error": "You do not have permission to update this organization"})
		return
	}

	id := c.Param("id")
	var organization models.Organization
	if err := models.DB.First(&organization, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Organization not found"})
		return
	}
	if err := c.ShouldBindJSON(&organization); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := models.DB.Save(&organization).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, organization)
}

func DeleteOrganization(c *gin.Context) {
	permissions, _ := c.Get("permissions")
	if !hasPermission(permissions, "write:organization") {
		c.JSON(http.StatusForbidden, gin.H{"error": "You do not have permission to delete this organization"})
		return
	}

	id := c.Param("id")
	if err := models.DB.Delete(&models.Organization{}, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Organization deleted"})
}
