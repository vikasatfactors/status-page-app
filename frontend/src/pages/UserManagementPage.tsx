// src/pages/Users.tsx
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth0 } from '@auth0/auth0-react';
import { useState, useEffect } from 'react';

const AUTH0_DOMAIN = import.meta.env.VITE_AUTH0_DOMAIN;

const UserManagementPage: React.FC = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ email: '', name: '' });

  const fetchUsers = async () => {
    const token = await getAccessTokenSilently();
    const response = await fetch(`https://${AUTH0_DOMAIN}/api/v2/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log('users--->', users);
    setUsers(await response.json());
  };

  const createUser = async () => {
    const token = await getAccessTokenSilently();
    await fetch(`https://${AUTH0_DOMAIN}/api/v2/users`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser),
    });
    setNewUser({ email: '', name: '' });
    fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <div className='flex gap-2 mb-4'>
        <Input
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          placeholder='User Name'
        />
        <Input
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          placeholder='User Email'
        />
        <Button onClick={createUser}>Create User</Button>
      </div>
      <ul>
        {users?.map((user) => (
          <li key={user.user_id}>
            {user.name} ({user.email})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserManagementPage;
