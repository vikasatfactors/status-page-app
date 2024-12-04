package models

import (
	"backend/auth0"
	"time"

	"gorm.io/gorm"
)

var DB *gorm.DB
var Auth0Client *auth0.Auth0Client

type User struct {
	gorm.Model
	Name           string `json:"name"`
	Email          string `json:"email" gorm:"unique"`
	PasswordHash   string `json:"password_hash"`
	Role           string `json:"role"`
	TeamID         string `json:"team_id"`
	OrganizationID string `json:"organization_id"`
}

type Team struct {
	ID             string `json:"id" gorm:"primaryKey"`
	Name           string `json:"name" gorm:"not null"`
	OrganizationID string `json:"organization_id" gorm:"not null"`
	Members        []User `json:"members"`
}

type TeamMembers struct {
	TeamID string `json:"team_id" gorm:"not null"`
	UserID string `json:"user_id" gorm:"not null"`
}

// Organization Model (Multi-Tenant)
type Organization struct {
	ID    string `json:"id" gorm:"primaryKey"`
	Name  string `json:"name" gorm:"not null"`
	Teams []Team `json:"teams"`
}

// Service Model
type Service struct {
	ID             string `json:"id" gorm:"primaryKey"`
	Name           string `json:"name" gorm:"uniqueIndex:idx_name_org"`
	Status         string `json:"status"`
	Description    string `json:"description"`
	OrganizationID string `json:"organization_id" gorm:"uniqueIndex:idx_name_org"`
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
