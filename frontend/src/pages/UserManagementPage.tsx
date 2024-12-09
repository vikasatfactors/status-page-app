import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const UserManagementPage: React.FC = () => {
  const { getAccessTokenSilently, user, isAuthenticated } = useAuth0();
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchUsers = async () => {
    try {
      const accessToken = await getAccessTokenSilently();

      const response = await axios.get(
        `https://${import.meta.env.VITE_AUTH0_DOMAIN}/api/v2/users`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const accessToken = await getAccessTokenSilently();

      const response = await axios.get(
        `https://${import.meta.env.VITE_AUTH0_DOMAIN}/api/v2/roles`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setRoles(response.data);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const createUser = async (email: string, password: string) => {
    try {
      const accessToken = await getAccessTokenSilently();

      const userData = {
        email,
        password,
        connection: 'Username-Password-Authentication',
      };

      await axios.post(
        `https://${import.meta.env.VITE_AUTH0_DOMAIN}/api/v2/users`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      alert('User created successfully');
      fetchUsers();
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      const accessToken = await getAccessTokenSilently();

      await axios.delete(
        `https://${import.meta.env.VITE_AUTH0_DOMAIN}/api/v2/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      alert('User deleted successfully');
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const assignRoleToUser = async (userId: string, roleId: string) => {
    try {
      const accessToken = await getAccessTokenSilently();

      await axios.post(
        `https://${
          import.meta.env.VITE_AUTH0_DOMAIN
        }/api/v2/users/${userId}/roles`,
        { roles: [roleId] },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      alert('Role assigned successfully');
      fetchUsers();
    } catch (error) {
      console.error('Error assigning role to user:', error);
    }
  };

  const handleRoleChange = async (
    userId: string,
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedRoleId = event.target.value;
    await assignRoleToUser(userId, selectedRoleId);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchUsers();
      fetchRoles();
    }
  }, [isAuthenticated]);

  return (
    <div>
      <h1>User Management</h1>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <div>
            <h3>Create a User</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const email = (e.target as any).email.value;
                const password = (e.target as any).password.value;
                createUser(email, password);
              }}
            >
              <input type='email' name='email' placeholder='Email' required />
              <input
                type='password'
                name='password'
                placeholder='Password'
                required
              />
              <button type='submit'>Create User</button>
            </form>
          </div>

          <h3>Users List</h3>
          <table>
            <thead>
              <tr>
                <th>Email</th>
                <th>Roles</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(users || []).map((user) => (
                <tr key={user.user_id}>
                  <td>{user.email}</td>
                  <td>
                    <select
                      onChange={(e) => handleRoleChange(user.user_id, e)}
                      defaultValue={user.roles?.[0]?.id || ''}
                    >
                      <option value=''>Assign Role</option>
                      {roles.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button onClick={() => deleteUser(user.user_id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default UserManagementPage;
