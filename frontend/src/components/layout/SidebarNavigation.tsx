import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { NavItems } from '@/lib/constants';

const SidebarNavigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className='flex-col w-64 bg-white border-r h-full p-4'>
      <nav className='space-y-2 flex-grow'>
        {NavItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname.startsWith(item.path);

          return (
            <Link key={item.path} to={item.path}>
              <Button
                variant={isActive ? 'secondary' : 'ghost'}
                className={cn(
                  'w-full justify-start space-x-2',
                  isActive && 'bg-secondary text-secondary-foreground'
                )}
              >
                <Icon className='w-4 h-4' />
                <span>{item.name}</span>
              </Button>
            </Link>
          );
        })}
      </nav>

      <div className='border-t mt-auto pt-4'>
      <Link key={'settings'} to='/settings'>

        <Button
          variant='outline'
          className='w-full'
          onClick={() => navigate('/settings')}
        >
          <Settings className='w-4 h-4 mr-2' />
          Account Settings
        </Button>
        </Link>

      </div>
    </div>
  );
};

export default SidebarNavigation;