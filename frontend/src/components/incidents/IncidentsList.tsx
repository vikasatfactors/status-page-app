import React from 'react';
import { Incident } from '@/types/types';
import LoadingSpinner from '../common/LoadingSpinner';
import { IncidentStatusMap, PRIORITY_CONFIG } from '@/lib/constants';

interface IncidentListProps {
  incidents: Incident[];
  onEdit: (incident: Incident) => void;
  onDelete: (id: string) => void;
  loading: boolean;
}

const formattedDate = (dateString: string) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return 'Invalid date';
  }
  return date.toLocaleString();
};

const IncidentList: React.FC<IncidentListProps> = ({
  incidents,
  onEdit,
  onDelete,
  loading,
}) => (
  <div className='space-y-4'>
    {loading ? (
      <LoadingSpinner message='Loading incidents...' />
    ) : incidents.length === 0 ? (
      <p className='text-gray-500'>No incidents available.</p>
    ) : (
      incidents.map((incident) => (
        <div
          key={incident.id}
          className='flex justify-between items-center border p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300'
        >
          <div className='flex-grow pr-4'>
            <div className='flex items-center space-x-2 mb-2'>
              <h3 className='font-bold text-lg'>{incident.title}</h3>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  PRIORITY_CONFIG[incident?.priority]
                }`}
              >
                {incident?.priority.charAt(0).toUpperCase() +
                  incident?.priority.slice(1)}
              </span>
            </div>

            <p className='text-sm text-gray-600 mb-2'>{incident.description}</p>

            <div className='flex items-center space-x-2 mb-2'>
              {IncidentStatusMap[incident.status]?.icon}
              <span
                className={`text-sm font-medium ${
                  IncidentStatusMap[incident.status]?.color
                }`}
              >
                {incident.status.charAt(0).toUpperCase() +
                  incident.status.slice(1)}
              </span>
            </div>

            <div className='text-xs text-gray-500 space-y-1'>
              <p>
                <span className='font-medium'>Created:</span>
                {formattedDate(incident.created_at)}
              </p>
              {incident.resolved_at && (
                <p>
                  <span className='font-medium'>Resolved:</span>
                  {formattedDate(incident.resolved_at)}
                </p>
              )}
            </div>
          </div>

          <div className='flex flex-col space-y-2'>
            <button
              onClick={() => onEdit(incident)}
              className='text-blue-500 hover:text-blue-700 transition-colors'
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(incident.id)}
              className='text-red-500 hover:text-red-700 transition-colors'
            >
              Delete
            </button>
          </div>
        </div>
      ))
    )}
  </div>
);

export default IncidentList;
