package handlers

import (
	"log"
	"net/http"
	"sync"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

var clients = make(map[*websocket.Conn]bool) // Store active WebSocket clients
var mutex = &sync.Mutex{}                    // Mutex for concurrent access to clients

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
	EnableCompression: true,
}

// StatusUpdates handles WebSocket connections and sends updates
func StatusUpdates(c *gin.Context) {
	log.Println("Headers: ", c.Request.Header)
	// Upgrade the HTTP connection to a WebSocket connection
	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Println("WebSocket upgrade failed:", err)
		return
	}
	defer conn.Close()

	// Register the WebSocket client
	mutex.Lock()
	clients[conn] = true
	mutex.Unlock()

	// Send an initial connection message
	err = conn.WriteJSON(map[string]string{
		"message": "You are now connected to the status updates stream.",
	})
	if err != nil {
		log.Println("Failed to send initial message to client:", err)
		mutex.Lock()
		delete(clients, conn)
		mutex.Unlock()
		return
	}

	// Listen for connection closure
	for {
		_, _, err := conn.ReadMessage()
		if err != nil {
			log.Println("WebSocket connection closed:", err)

			mutex.Lock()
			delete(clients, conn)
			mutex.Unlock()
			break
		}
	}
}

func BroadcastUpdate(message string) {
	mutex.Lock()
	defer mutex.Unlock()

	update := map[string]string{"update": message}

	for client := range clients {
		err := client.WriteJSON(update)
		if err != nil {
			log.Printf("Error sending update to client: %v. Closing connection.", err)
			client.Close()
			delete(clients, client)
		}
	}
}
