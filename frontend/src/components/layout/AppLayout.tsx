import React from 'react';
import Header from './Header';
import SidebarNavigation from './SidebarNavigation';
import { useAuth0 } from '@auth0/auth0-react';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { isAuthenticated } = useAuth0();
  return (
    <div className='h-screen flex flex-col'>
      <Header />

      <div className='flex flex-grow overflow-hidden'>
        {isAuthenticated && <SidebarNavigation />}
        <div className='flex-grow bg-gray-100 p-4 overflow-auto'>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
