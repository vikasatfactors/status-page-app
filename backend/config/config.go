package config

import (
	"backend/models"
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func LoadEnv() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
}

func GetEnv(key string) string {
	return os.Getenv(key)
}

func InitDB() error {
	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s port=%s sslmode=disable",
		GetEnv("DB_HOST"), GetEnv("DB_USER"), GetEnv("DB_PASSWORD"), GetEnv("DB_PORT"),
	)
	var err error
	models.DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to the database: %v", err)
		return err
	}

	// Run migrations for all models
	models.DB.AutoMigrate(&models.Team{}, &models.Organization{}, &models.Service{}, &models.Incident{})
	// Create dummy data
	// createDummyData(models.DB)
	return nil

}

// func createDummyData(db *gorm.DB) {
// 	// Add Organizations
// 	org1 := models.Organization{Name: "Org One"}
// 	org2 := models.Organization{Name: "Org Two"}
// 	db.Create(&org1)
// 	db.Create(&org2)

// 	// Add Users
// 	users := []models.User{
// 		{Name: "Admin One", Email: "admin1@example.com", Role: "admin", OrganizationID: org1.ID},
// 		{Name: "User One", Email: "user1@example.com", Role: "user", OrganizationID: org1.ID},
// 		{Name: "Admin Two", Email: "admin2@example.com", Role: "admin", OrganizationID: org2.ID},
// 		{Name: "User Two", Email: "user2@example.com", Role: "user", OrganizationID: org2.ID},
// 	}
// 	db.Create(&users)

// 	// Add Teams
// 	teams := []models.Team{
// 		{Name: "Team Alpha", OrganizationID: org1.ID},
// 		{Name: "Team Beta", OrganizationID: org1.ID},
// 		{Name: "Team Gamma", OrganizationID: org2.ID},
// 	}
// 	db.Create(&teams)

// 	// Add Services
// 	services := []models.Service{
// 		{Name: "Website", Status: "operational", OrganizationID: org1.ID},
// 		{Name: "API", Status: "degraded", OrganizationID: org1.ID},
// 		{Name: "Database", Status: "major_outage", OrganizationID: org2.ID},
// 	}
// 	db.Create(&services)

// 	// Add Incidents
// 	incidents := []models.Incident{
// 		{
// 			Title:       "Website Outage",
// 			Description: "The website is down for all users.",
// 			Status:      "investigating",
// 			ServiceID:   services[0].ID,
// 			CreatedAt:   time.Now().Add(-2 * time.Hour),
// 			UpdatedAt:   time.Now().Add(-1 * time.Hour),
// 			ResolvedAt:  nil,
// 		},
// 		{
// 			Title:       "API Slow Responses",
// 			Description: "API is responding slowly due to increased load.",
// 			Status:      "active",
// 			ServiceID:   services[1].ID,
// 			CreatedAt:   time.Now().Add(-3 * time.Hour),
// 			UpdatedAt:   time.Now().Add(-2 * time.Hour),
// 			ResolvedAt:  nil,
// 		},
// 	}
// 	db.Create(&incidents)

// 	log.Println("Dummy data created successfully!")
// }
