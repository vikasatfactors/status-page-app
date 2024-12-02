import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import ServiceList from '@/components/services/ServiceList';
import ServiceForm from '@/components/services/ServiceForm';
import {
  getServices,
  createService,
  updateService,
  deleteService,
} from '@/lib/api';
import { Service } from '@/types/types';

const ServiceManagementPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | undefined>();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

  const loadServices = async () => {
    setLoading(true);
    try {
      const data = await getServices();
      setServices(data);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (newService: Service) => {
    await createService(newService);
    await loadServices();
    setShowForm(false);
  };

  const handleUpdate = async (updatedService: Service) => {
    await updateService(updatedService.id, updatedService);
    await loadServices();
    setShowForm(false);
  };

  const handleDelete = async (id: string) => {
    await deleteService(id);
    await loadServices();
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleEdit = (service: Service) => {
    setSelectedService(service);
    setShowForm(true);
  };

  return (
    <div className='container mx-auto p-6'>
      <h1 className='text-3xl font-bold mb-6'>Service Management</h1>
      <Button onClick={() => setShowForm(true)} className='mb-4'>
        Add New Service
      </Button>
      {showForm ? (
        <ServiceForm
          initialData={selectedService}
          onSave={selectedService ? handleUpdate : handleCreate}
          onCancel={() => setShowForm(false)}
        />
      ) : (
        <ServiceList
          services={services}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
        />
      )}
    </div>
  );
};

export default ServiceManagementPage;
