import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import LogoutButton from './LogoutButton';
import LoadingSpinner from '../common/LoadingSpinner';

const Profile: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center space-x-4'>
        <Avatar className='w-12 h-12'>
          <AvatarImage src={user?.picture} alt={user?.name || 'User profile'} />
          <AvatarFallback>
            {user?.name ? user.name.charAt(0).toUpperCase() : 'UN'}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className='text-lg font-semibold'>{user?.name}</h3>
          <p className='text-sm text-muted-foreground'>{user?.email}</p>
        </div>
      </div>

      {user?.org_id && (
        <div className='flex justify-between items-center'>
          <span className='text-sm'>Organization</span>
          <Badge variant='outline'>
            {user['https://mystatuspageapp.com/org_name']}
          </Badge>
        </div>
      )}

      <div className='space-y-2'>
        <div className='flex justify-between items-center'>
          <span className='text-sm'>Auth Provider</span>
          <Badge variant='secondary'>{user?.sub?.split('|')[0]}</Badge>
        </div>

        {user?.email_verified !== undefined && (
          <div className='flex justify-between items-center'>
            <span className='text-sm'>Email Verified</span>
            <Badge variant={user.email_verified ? 'default' : 'destructive'}>
              {user.email_verified ? 'Yes' : 'No'}
            </Badge>
          </div>
        )}
      </div>

      <LogoutButton />
    </div>
  );
};

export default Profile;
