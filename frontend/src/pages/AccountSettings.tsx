import { fetchRoles, fetchUsers, updateUserRole } from "@/lib/api";
import React, { useEffect, useState } from "react";

const AccountSettings = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const usersData = await fetchUsers();
        setUsers(usersData);

        const rolesData = await fetchRoles();
        setRoles(rolesData);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadData();
  }, []);

  const handleUpdateRole = async () => {
    if (!selectedUser || !newRole) return;

    try {
      await updateUserRole(selectedUser, newRole);
      alert("Role updated successfully!");
      const updatedUsers = await fetchUsers();
      setUsers(updatedUsers);
    } catch (error) {
      console.error("Error updating role:", error);
      alert("Failed to update role.");
    }
  };

  return (
    <div>
      <h2>Account Settings</h2>
      <div>
        <h3>Users</h3>
        <select onChange={(e) => setSelectedUser(e.target.value)}>
          <option value="">Select a user</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name} ({user.email})
            </option>
          ))}
        </select>
      </div>

      <div>
        <h3>Roles</h3>
        <select onChange={(e) => setNewRole(e.target.value)}>
          <option value="">Select a role</option>
          {roles.map((role) => (
            <option key={role.id} value={role.id}>
              {role.name}
            </option>
          ))}
        </select>
      </div>

      <button onClick={handleUpdateRole} disabled={!selectedUser || !newRole}>
        Update Role
      </button>
    </div>
  );
};

export default AccountSettings;
