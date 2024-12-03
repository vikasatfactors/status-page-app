import React, { useState, useEffect } from 'react';
import { Incident } from '@/types/types';
import { Button } from '@/components/ui/button';
import { generateHashID } from '@/lib/utils';

interface IncidentFormProps {
  onSave: (incident: Incident) => void;
  initialData?: Incident;
  onCancel: () => void;
}

const IncidentForm: React.FC<IncidentFormProps> = ({
  onSave,
  onCancel,
  initialData,
}) => {
  const [formState, setFormState] = useState({
    title: '',
    description: '',
    status: 'investigating' as Incident['status'],
    service_id: '',
  });

  // Sync form state with initialData when it changes
  useEffect(() => {
    if (initialData) {
      setFormState({
        title: initialData.title,
        description: initialData.description,
        status: initialData.status,
        service_id: initialData.service_id,
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: initialData?.id || generateHashID(),
      title: formState.title,
      description: formState.description,
      status: formState.status,
      service_id: formState.service_id,
      updated_at: new Date().toISOString(),
      created_at: initialData?.created_at || new Date().toISOString(),
      priority: 'low',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium">
          Title
        </label>
        <input
          id="title"
          name="title"
          value={formState.title}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formState.description}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label htmlFor="service" className="block text-sm font-medium">
          Affected Service
        </label>
        <input
          id="service"
          name="service_id"
          value={formState.service_id}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium">
          Status
        </label>
        <select
          id="status"
          name="status"
          value={formState.status}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="investigating">Investigating</option>
          <option value="active">Active</option>
          <option value="monitoring">Monitoring</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      <div className="flex space-x-2">
        <Button type="submit">Save Incident</Button>
        <Button type="button" onClick={onCancel} variant="outline">
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default IncidentForm;
