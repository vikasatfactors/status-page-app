import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2, Info, XCircle } from 'lucide-react';

type NotificationType = 'info' | 'success' | 'warning' | 'error';

interface NotificationBannerProps {
  message: string;
  type?: NotificationType;
  duration?: number;
  onClose?: () => void;
}

const NotificationBanner: React.FC<NotificationBannerProps> = ({
  message,
  type = 'info',
  duration = 3000,
  onClose,
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const iconMap: Record<NotificationType, React.ReactNode> = {
    info: <Info className='h-4 w-4' />,
    success: <CheckCircle2 className='h-4 w-4' />,
    warning: <AlertCircle className='h-4 w-4' />,
    error: <XCircle className='h-4 w-4' />,
  };

  const variantMap: Record<NotificationType, string> = {
    info: 'default',
    success: 'success',
    warning: 'warning',
    error: 'destructive',
  };

  if (!visible) return null;

  return (
    <div className='absolute top-0'>
      <Alert variant={variantMap[type]}>
        {iconMap[type]}
        <AlertTitle>{type.charAt(0).toUpperCase() + type.slice(1)}</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    </div>
  );
};

export default NotificationBanner;
