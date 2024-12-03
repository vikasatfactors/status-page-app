import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth0 } from '@auth0/auth0-react';
import { User } from '@/types/types'; // Your user type definition
import { Edit, Trash } from 'lucide-react';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const UserManagementPage: React.FC = () => {
  const { user, getAccessTokenSilently } = useAuth0();
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch('http://localhost:8080/api/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle user creation
  const createUser = async () => {
    if (!newUser) return;

    try {
      const token = await getAccessTokenSilently();
      const response = await fetch('http://localhost:8080/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newUser),
      });
      if (response.ok) {
        fetchUsers(); // Refresh users list
        setNewUser(null); // Clear form
      }
    } catch (error) {
      console.error('Error creating user', error);
    }
  };

  // Handle user deletion
  const deleteUser = async (userId: string) => {
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(
        `http://localhost:8080/api/users/${userId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        fetchUsers(); // Refresh users list
      }
    } catch (error) {
      console.error('Error deleting user', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [user]);

  if (loading) return <LoadingSpinner message='Loading users...'/>;

  return (
    <div className='container mx-auto p-6 max-w-4xl'>
      <h1 className='text-3xl font-bold mb-6'>User Management</h1>

      {/* Add New User */}
      <Card className='mb-6'>
        <CardHeader>
          <CardTitle>Add New User</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            <div>
              <Input
                placeholder='Name'
                value={newUser?.name || ''}
                onChange={(e) =>
                  setNewUser({ ...newUser, name: e.target.value } as User)
                }
              />
            </div>
            <div>
              <Input
                placeholder='Email'
                value={newUser?.email || ''}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value } as User)
                }
              />
            </div>
            <div>
              <Button onClick={createUser} className='w-full'>
                Create User
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User List */}
      <Card>
        <CardHeader>
          <CardTitle>User List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {users.map((user) => (
              <div
                key={user.id}
                className='flex justify-between items-center py-3 border-b last:border-b-0'
              >
                <div>
                  <span className='font-medium'>{user.name}</span>
                  <p className='text-sm text-gray-500'>{user.email}</p>
                </div>
                <div className='flex items-center space-x-2'>
                  <Button
                    variant='link'
                    onClick={() => console.log('Edit User')}
                  >
                    <Edit className='h-5 w-5 text-blue-500' />
                  </Button>
                  <Button variant='link' onClick={() => deleteUser(user.id)}>
                    <Trash className='h-5 w-5 text-red-500' />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagementPage;
