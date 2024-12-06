import React from 'react';
import { Auth0Provider } from '@auth0/auth0-react';
import { PropsWithChildren } from 'react';

const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: import.meta.env.VITE_AUTH0_CALLBACK_URL,
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        scope: "openid profile email read:services write:services"
      }}
    >
      {children}
    </Auth0Provider>
  );
};

export default AuthProvider;
