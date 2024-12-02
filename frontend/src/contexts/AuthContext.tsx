import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

interface AuthContextType {
  token: string | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { getAccessTokenSilently, isAuthenticated, isLoading } = useAuth0();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      if (isAuthenticated) {
        try {
          const accessToken = await getAccessTokenSilently();
          setToken(accessToken);
          // Store token in localStorage for use globally
          localStorage.setItem('authToken', accessToken);
        } catch (err) {
          console.error('Error fetching token', err);
        }
      }
    };

    if (!isLoading && isAuthenticated) {
      fetchToken();
    }
  }, [isAuthenticated, isLoading]);

  return (
    <AuthContext.Provider value={{ token: token, loading: isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
