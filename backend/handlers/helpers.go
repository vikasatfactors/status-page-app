package handlers

import (
	"crypto/rand"
	"encoding/hex"
)

func hasPermission(permissions interface{}, permission string) bool {
	permList, ok := permissions.([]interface{})
	if !ok {
		return false
	}

	for _, perm := range permList {
		if perm == permission {
			return true
		}
	}
	return false
}

func GenerateRandomHashID(length int) (string, error) {
	bytes := make([]byte, length/2)
	_, err := rand.Read(bytes)
	if err != nil {
		return "", err
	}
	return hex.EncodeToString(bytes), nil
}
