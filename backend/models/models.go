package models

import (
	"time"

	"gorm.io/gorm"
)

var DB *gorm.DB

type User struct {
	gorm.Model
	Name           string `json:"name"`
	Email          string `json:"email" gorm:"unique"`
	PasswordHash   string `json:"password_hash"`
	Role           string `json:"role"`
	TeamID         string `json:"team_id"`
	OrganizationID string `json:"org_id"`
}

// Team Model
type Team struct {
	ID             string `json:"id" gorm:"primaryKey"`
	Name           string `json:"name"`
	OrganizationID string `json:"org_id"`
}

// Organization Model (Multi-Tenant)
type Organization struct {
	ID   string `json:"id" gorm:"primaryKey"`
	Name string `json:"name"`
}

// Service Model
type Service struct {
	ID             string `json:"id" gorm:"primaryKey"`
	Name           string `json:"name"`
	Status         string `json:"status"`
	Description    string `json:"description"`
	OrganizationID string `json:"org_id"`
}

// Incident Model
type Incident struct {
	ID          string     `json:"id" gorm:"primaryKey"`
	Title       string     `json:"title"`
	Description string     `json:"description"`
	Status      string     `json:"status"` // e.g., "active", "resolved"
	Priority    string     `json:"priority"`
	ServiceID   string     `json:"service_id"`
	CreatedAt   time.Time  `json:"created_at"`
	UpdatedAt   time.Time  `json:"updated_at"`
	ResolvedAt  *time.Time `json:"resolved_at"`
}
