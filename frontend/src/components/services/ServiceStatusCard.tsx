import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ServiceStatusBadgeMap } from '@/lib/constants';

interface ServiceStatusCardProps {
  name: string;
  status: keyof typeof ServiceStatusBadgeMap;
}

const ServiceStatusCard: React.FC<ServiceStatusCardProps> = ({ name, status }) => {
  const { icon, label, className } = ServiceStatusBadgeMap[status];

  return (
    <div className="flex justify-between items-center p-4 border rounded shadow-sm">
      <span className="font-medium">{name}</span>
      <div className="flex items-center space-x-2">
        {icon}
        <Badge className={className}>{label}</Badge>
      </div>
    </div>
  );
};

export default ServiceStatusCard;
