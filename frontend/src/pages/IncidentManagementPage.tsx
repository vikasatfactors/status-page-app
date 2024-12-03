import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  getIncidents,
  createIncident,
  updateIncident,
  deleteIncident,
} from '@/lib/api';
import { Incident } from '@/types/types';
import IncidentForm from '@/components/incidents/IncidentForm';
import IncidentList from '@/components/incidents/IncidentsList';

const IncidentManagementPage: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(
    null
  );
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

  const loadIncidents = async () => {
    setLoading(true); // Start loading
    try {
      const data = await getIncidents();
      setIncidents(data);
    } catch (error) {
      console.error('Error fetching incidents:', error);
    } finally {
      setLoading(false); // End loading
    }
  };

  const handleCreateOrUpdate = async (incident: Incident) => {
    if (selectedIncident) {
      // Update mode
      await updateIncident(selectedIncident.id, incident);
    } else {
      // Create mode
      await createIncident(incident);
    }
    await loadIncidents();
    setShowForm(false);
    setSelectedIncident(null); // Reset the selected incident
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteIncident(id);
      await loadIncidents();
    } catch (error) {
      console.error('Error deleting incident:', error);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setSelectedIncident(null); // Reset the selected incident
  };

  useEffect(() => {
    loadIncidents();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Incident Management</h1>
      <Button onClick={() => setShowForm(true)} className="mb-4">
        Add New Incident
      </Button>
      {showForm ? (
        <IncidentForm
          initialData={selectedIncident} // Pass initialData correctly
          onSave={handleCreateOrUpdate}
          onCancel={handleCancel}
        />
      ) : (
        <IncidentList
          incidents={incidents}
          onEdit={(incident) => {
            setSelectedIncident(incident);
            setShowForm(true);
          }}
          onDelete={handleDelete}
          loading={loading} // Pass the loading state here
        />
      )}
    </div>
  );
};

export default IncidentManagementPage;
