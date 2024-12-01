package models

import "gorm.io/gorm"

var DB *gorm.DB

type User struct {
	gorm.Model
	Name           string `json:"name"`
	Email          string `json:"email" gorm:"unique"`
	PasswordHash   string `json:"-"`
	Role           string `json:"role"` // e.g., "admin", "member"
	TeamID         uint   `json:"team_id"`
	OrganizationID uint   `json:"organization_id"`
}

// Team Model
type Team struct {
	ID   uint   `json:"id" gorm:"primaryKey"`
	Name string `json:"name"`
}

// Organization Model (Multi-Tenant)
type Organization struct {
	ID   uint   `json:"id" gorm:"primaryKey"`
	Name string `json:"name"`
}

// Service Model
type Service struct {
	ID          uint   `json:"id" gorm:"primaryKey"`
	Name        string `json:"name"`
	Status      string `json:"status"`
	Description string `json:"description"`
}

// Incident Model
type Incident struct {
	ID          uint   `json:"id" gorm:"primaryKey"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Status      string `json:"status"` // e.g., "active", "resolved"
	ServiceID   uint   `json:"service_id"`
}