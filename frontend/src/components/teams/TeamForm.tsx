import React, { useState } from 'react';
import { Team } from '@/types/types';
import { Button } from '@/components/ui/button';

interface TeamFormProps {
  onSave: (team: Team) => void;
  onCancel: () => void;
  initialData?: Team;
}

const TeamForm: React.FC<TeamFormProps> = ({ onSave, initialData }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ id: initialData?.id || Date.now(), name, description });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium">
          Team Name
        </label>
        <input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
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
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>
      <Button type="submit">Save Team</Button>
    </form>
  );
};

export default TeamForm;
