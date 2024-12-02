import React from 'react';
import { Service } from '@/types/types';
import LoadingSpinner from '../common/LoadingSpinner';

interface ServiceListProps {
  services: Service[];
  onEdit: (service: Service) => void;
  onDelete: (id: string) => void;
  loading: boolean; // Add loading prop
}

const ServiceList: React.FC<ServiceListProps> = ({
  services,
  onEdit,
  onDelete,
  loading,
}) => (
  <div className='space-y-4'>
    {loading ? (
      <LoadingSpinner message='Loading services...' />
    ) : services.length === 0 ? (
      <p className='text-gray-500'>No services available.</p>
    ) : (
      services.map((service) => (
        <div
          key={service.id}
          className='flex justify-between items-center border p-4 rounded'
        >
          <div>
            <h3 className='font-bold'>{service.name}</h3>
            <p className='text-sm text-gray-500'>{service.description}</p>
          </div>
          <div className='flex items-center space-x-4'>
            <button
              onClick={() => onEdit(service)}
              className='text-blue-500 hover:underline'
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(service.id)}
              className='text-red-500 hover:underline'
            >
              Delete
            </button>
          </div>
        </div>
      ))
    )}
  </div>
);

export default ServiceList;
