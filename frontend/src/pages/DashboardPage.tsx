import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setServices, setLoading, setError } from '@/store/servicesSlice';
import { getServices, updateService } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Server } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ServiceStatusRow from '@/components/services/ServiceStatusRow';
import { Service } from '@/types/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { addMessage } from '@/store/wsSlice';
import { useWebSocket } from '@/contexts/WebSocketContext';

const DashboardPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { services, loading } = useSelector((state: any) => state.services);

  // Handle incoming WebSocket messages
  const handleWebSocketMessage = (rawMessage: string) => {
    try {
      const parsedMessage = JSON.parse(rawMessage); // Parse the JSON string
      const update = parsedMessage.update; // Extract the `update` field

      if (update) {
        const timestamp = new Date().toLocaleString();
        dispatch(addMessage({ message: update, timestamp }));
        console.log(update, timestamp);
      }
    } catch (error) {
      console.error('Failed to parse WebSocket message:', rawMessage, error);
    }
  };

  useWebSocket(handleWebSocketMessage);

  // Fetch services when the component is mounted
  useEffect(() => {
    const fetchServices = async () => {
      dispatch(setLoading()); // Set loading state in Redux
      try {
        const data = await getServices();
        dispatch(setServices(data)); // Store fetched services in Redux
      } catch (err) {
        console.error('Error fetching services:', err);
        dispatch(setError('Failed to load services')); // Handle error in Redux
      }
    };

    fetchServices();
  }, [dispatch]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const updatedService = await updateService(id, { status: newStatus });
      dispatch(
        setServices(
          services.map((service: Service) =>
            service.id === id ? { ...service, ...updatedService } : service
          )
        )
      );
    } catch (error) {
      console.error('Error updating service status:', error);
    }
  };

  return (
    <div className='container mx-auto p-6'>
      <div className='grid grid-cols-1 gap-6'>
        <div className='flex justify-end'>
          <Button onClick={() => navigate('/services')}>
            <Server className='mr-2 h-4 w-4' />
            Manage Services
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Your Services</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <LoadingSpinner message='Loading services...' />
            ) : services.length === 0 ? (
              <p className='text-muted-foreground'>
                No services configured. Click "Add New Service" to get started.
              </p>
            ) : (
              <ul className='space-y-4'>
                {services.map((service) => (
                  <ServiceStatusRow
                    key={service.id}
                    name={service.name}
                    status={service.status}
                    onClick={(newStatus) =>
                      handleStatusChange(service.id, newStatus)
                    }
                  />
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
