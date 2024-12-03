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

	models.DB.AutoMigrate(&models.Team{}, &models.Organization{}, &models.Service{}, &models.Incident{})
	return nil

}
