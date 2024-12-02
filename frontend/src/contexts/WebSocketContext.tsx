// WebSocketContext.tsx (Consolidated file)
import { useAuth0 } from '@auth0/auth0-react';
import React, { createContext, useContext, useState, useEffect } from 'react';

interface WebSocketContextType {
  socket: WebSocket | null;
  sendMessage: (message: string) => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const url = 'ws://localhost:8080/status-updates';
  const { getAccessTokenSilently, isAuthenticated, isLoading } = useAuth0();

  useEffect(() => {
    const fetchToken = async () => {
      if (isAuthenticated) {
        try {
          const accessToken = await getAccessTokenSilently();
          setToken(accessToken);
        } catch (err) {
          console.error('Error fetching token', err);
        }
      }
    };

    if (!isLoading && isAuthenticated) {
      fetchToken();
    }
  }, [isAuthenticated, isLoading]);

  useEffect(() => {
    const ws = new WebSocket(`${url}?token=${token}`);
    setSocket(ws);

    ws.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      ws.close();
    };
  }, [url, token]);

  // Function to send a message to WebSocket
  const sendMessage = (message: string) => {
    if (socket) {
      socket.send(message);
    }
  };

  return (
    <WebSocketContext.Provider value={{ socket, sendMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
};

// Custom hook to use WebSocket
export const useWebSocket = (onMessage: (message: string) => void) => {
  const context = useContext(WebSocketContext);

  useEffect(() => {
    if (context?.socket) {
      context.socket.onmessage = (event) => {
        const message = event.data;
        onMessage(message);
      };
    }
  }, [context, onMessage]);

  return context;
};
