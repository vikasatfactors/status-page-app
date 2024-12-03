import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate, useParams } from 'react-router-dom';
import { User } from '@/types/types'; // assuming a type User is created
import { generateHashID } from '@/lib/utils';

const UserForm: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('user');
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      // Simulate fetching the user by ID
      const mockUser: User = {
        id: generateHashID(),
        name: 'Alice',
        email: 'alice@example.com',
        role: 'admin',
      };
      setUser(mockUser);
      setName(mockUser.name);
      setEmail(mockUser.email);
      setRole(mockUser.role);
    }
  }, [userId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/admin/users');
  };

  if (!user && userId) {
    return <div>Loading...</div>;
  }

  return (
    <div className='container mx-auto p-6 max-w-4xl'>
      <h1 className='text-3xl font-bold mb-6'>
        {userId ? 'Edit User' : 'Create New User'}
      </h1>

      <form onSubmit={handleSubmit} className='space-y-6'>
        <div className='flex flex-col'>
          <label className='text-sm font-medium text-gray-700'>Name</label>
          <input
            type='text'
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className='px-4 py-2 mt-2 border border-gray-300 rounded-md'
          />
        </div>

        <div className='flex flex-col'>
          <label className='text-sm font-medium text-gray-700'>Email</label>
          <input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className='px-4 py-2 mt-2 border border-gray-300 rounded-md'
          />
        </div>

        <div className='flex flex-col'>
          <label className='text-sm font-medium text-gray-700'>Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className='px-4 py-2 mt-2 border border-gray-300 rounded-md'
          >
            <option value='user'>User</option>
            <option value='admin'>Admin</option>
            <option value='manager'>Manager</option>
          </select>
        </div>

        <div className='flex justify-end space-x-4'>
          <Button
            type='button'
            onClick={() => navigate('/admin/users')}
            variant='secondary'
          >
            Cancel
          </Button>
          <Button type='submit'>
            {userId ? 'Update User' : 'Create User'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
