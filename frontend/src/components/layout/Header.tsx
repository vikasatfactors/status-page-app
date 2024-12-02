import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Link } from 'react-router-dom';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import LoginButton from '../auth/LoginButton';
import Profile from '../auth/Profile';
import { User } from '@/types/types';
import { Button } from '../ui/button';
import WebSocketMessages from './WebSocketMessages';

const Header: React.FC = () => {
  const { isAuthenticated, user } = useAuth0();

  return (
    <header className='h-16 bg-white px-6 py-2 flex items-center justify-between border-b border-gray-200 shadow-lg'>
      <Brand />
      <div className='flex items-center space-x-4'>
        <WebSocketMessages />
        <AuthSection isAuthenticated={isAuthenticated} user={user as User} />
      </div>
    </header>
  );
};

const Brand: React.FC = () => (
  <Link to='/' className='text-2xl font-bold text-primary'>
    KnowStatus
  </Link>
);

const AuthSection: React.FC<{
  isAuthenticated: boolean;
  user: User;
}> = ({ isAuthenticated, user }) => (
  <div className='flex items-center space-x-4'>
    {isAuthenticated ? <UserMenu user={user} /> : <LoginButton />}
  </div>
);

const UserMenu: React.FC<{ user: User }> = ({ user }) => {
  const userName = user?.name || 'User';

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          className='text-sm text-white bg-green-600 hover:bg-green-700 transition-colors'
        >
          Hello, {userName}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side='bottom'
        align='end'
        className='w-64 p-4 bg-white rounded-lg shadow-md space-y-4'
      >
        <Profile />
      </PopoverContent>
    </Popover>
  );
};

export default Header;
