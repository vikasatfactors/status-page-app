import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import TeamList from '@/components/teams/TeamList';
import TeamForm from '@/components/teams/TeamForm';
import { getTeams, createTeam, updateTeam, deleteTeam } from '@/lib/api';
import { Team } from '@/types/types';

const TeamManagementPage: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState<boolean>(false); // Add loading state

  const loadTeams = async () => {
    setLoading(true); // Start loading
    try {
      const data = await getTeams();
      setTeams(data);
    } catch (error) {
      console.error('Error fetching teams:', error);
    } finally {
      setLoading(false); // End loading
    }
  };

  const handleCreate = async (newTeam: Team) => {
    await createTeam(newTeam);
    await loadTeams();
    setShowForm(false);
  };

  const handleUpdate = async (updatedTeam: Team) => {
    await updateTeam(updatedTeam.id, updatedTeam);
    await loadTeams();
    setShowForm(false);
  };

  const handleDelete = async (id: string) => {
    await deleteTeam(id);
    await loadTeams();
  };

  useEffect(() => {
    loadTeams();
  }, []);

  return (
    <div className='container mx-auto p-6'>
      <h1 className='text-3xl font-bold mb-6'>Team Management</h1>
      <Button onClick={() => setShowForm(true)} className='mb-4'>
        Add New Team
      </Button>
      {showForm && (
        <TeamForm
          initialData={selectedTeam}
          onSave={selectedTeam ? handleUpdate : handleCreate}
          onCancel={() => setShowForm(false)}
        />
      )}
      <TeamList
        teams={teams}
        onEdit={(team: Team) => {
          setSelectedTeam(team);
          setShowForm(true);
        }}
        onDelete={handleDelete}
        loading={loading}
      />
    </div>
  );
};

export default TeamManagementPage;
