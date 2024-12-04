export const API_URL = '//www.sumitnegi.me';

import {
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  XCircle,
  Home,
  Server,
  Users,
  ClockIcon,
  CheckCircleIcon,
} from 'lucide-react';

// Status Badge Map
export const ServiceStatusBadgeMap = {
  operational: {
    icon: <CheckCircle2 className='text-green-500' />,
    label: 'Operational',
    className: 'bg-green-100 text-green-800',
  },
  degraded: {
    icon: <AlertTriangle className='text-yellow-500' />,
    label: 'Degraded Performance',
    className: 'bg-yellow-100 text-yellow-800',
  },
  partial_outage: {
    icon: <AlertCircle className='text-orange-500' />,
    label: 'Partial Outage',
    className: 'bg-orange-100 text-orange-800',
  },
  major_outage: {
    icon: <XCircle className='text-red-500' />,
    label: 'Major Outage',
    className: 'bg-red-100 text-red-800',
  },
};

export const IncidentStatusMap = {
  active: {
    color: 'text-yellow-600',
    icon: <ClockIcon className='w-5 h-5 text-yellow-600' />,
  },
  investigating: {
    color: 'text-blue-600',
    icon: <ClockIcon className='w-5 h-5 text-blue-600' />,
  },
  resolved: {
    color: 'text-green-600',
    icon: <CheckCircleIcon className='w-5 h-5 text-green-600' />,
  },
  monitoring: {
    color: 'text-gray-600',
    icon: <CheckCircleIcon className='w-5 h-5 text-gray-600' />,
  },
};

// Priority color mapping
export const PRIORITY_CONFIG = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  critical: 'bg-red-100 text-red-800',
};

export const NavItems = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: Home,
  },
  {
    name: 'Services',
    path: '/services',
    icon: Server,
  },
  {
    name: 'Incidents',
    path: '/incidents',
    icon: AlertTriangle,
  },
  {
    name: 'Team',
    path: '/teams',
    icon: Users,
  },
  {
    name: 'Users',
    path: '/users',
    icon: Users,
  },
];
