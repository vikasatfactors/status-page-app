import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import ServiceStatusCard from '../services/ServiceStatusCard';
import { Service, Incident } from '@/types/types';
import { getPublicStatus } from '@/lib/api';
import LoadingSpinner from '../common/LoadingSpinner';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { useDispatch } from 'react-redux';
import { addMessage } from '@/store/wsSlice';

const PublicStatusPage: React.FC = () => {
  const dispatch = useDispatch();

  const [services, setServices] = useState<Service[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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

  useEffect(() => {
    const fetchStatusData = async () => {
      try {
        const data = await getPublicStatus();
        const { incidents, services } = data;
        setServices(services);
        setIncidents(incidents);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching status data:', error);
        setLoading(false);
      }
    };

    fetchStatusData();
  }, []);

  if (loading) return <LoadingSpinner message='Loading status...' />;

  return (
    <div className='container mx-auto p-6 max-w-4xl'>
      <h1 className='text-3xl font-bold mb-6'>System Status</h1>

      {/* Services Status */}
      <Card className='mb-6'>
        <CardHeader>
          <CardTitle>Service Status</CardTitle>
        </CardHeader>
        <CardContent>
          {services.map((service) => (
            <ServiceStatusCard
              key={service.id}
              name={service.name}
              status={service.status}
            />
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active Incidents</CardTitle>
        </CardHeader>
        <CardContent>
          {incidents.length === 0 ? (
            <p className='text-gray-500'>No active incidents</p>
          ) : (
            incidents
              .filter((incident) => incident.status == 'active')
              .map((incident) => (
                <div
                  key={incident.id}
                  className='py-3 border-b last:border-b-0'
                >
                  <div className='flex justify-between items-center'>
                    <div>
                      <h3 className='font-semibold'>{incident.title}</h3>
                      <p className='text-sm text-gray-500'>{incident.status}</p>
                    </div>
                    <span className='text-sm text-gray-500'>
                      {new Date(incident.UpdatedAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PublicStatusPage;
