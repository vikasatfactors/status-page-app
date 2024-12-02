import React, { useEffect, useState } from 'react';
import { Service } from '@/types/types';
import { Button } from '@/components/ui/button';
import { generateHashID } from '@/lib/utils';

interface ServiceFormProps {
  onSave: (service: Service) => void;
  onCancel: () => void;
  initialData?: Service;
}

const ServiceForm: React.FC<ServiceFormProps> = ({
  onSave,
  onCancel,
  initialData,
}) => {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(
    initialData?.description || ''
  );
  const [status, setStatus] = useState<Service['status']>(
    initialData?.status || 'operational'
  );

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDescription(initialData?.description);
      setStatus(initialData.status);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: initialData?.id || generateHashID(),
      name,
      description,
      status,
    });
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div>
        <label htmlFor='name' className='block text-sm font-medium'>
          Service Name
        </label>
        <input
          id='name'
          value={name}
          onChange={(e) => setName(e.target.value)}
          className='w-full border p-2 rounded'
          required
        />
      </div>

      <div>
        <label htmlFor='description' className='block text-sm font-medium'>
          Description
        </label>
        <textarea
          id='description'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className='w-full border p-2 rounded'
        />
      </div>

      <div>
        <label htmlFor='status' className='block text-sm font-medium'>
          Status
        </label>
        <select
          id='status'
          value={status}
          onChange={(e) => setStatus(e.target.value as Service['status'])}
          className='w-full border p-2 rounded'
        >
          <option value='operational'>Operational</option>
          <option value='degraded'>Degraded Performance</option>
          <option value='partial_outage'>Partial Outage</option>
          <option value='major_outage'>Major Outage</option>
        </select>
      </div>

      <div className='flex justify-end space-x-4'>
        <Button type='button' onClick={onCancel}>
          Cancel
        </Button>
        <Button type='submit'>Save Service</Button>
      </div>
    </form>
  );
};

export default ServiceForm;
