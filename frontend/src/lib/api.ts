import apiClient from './apiClient';

// Fetch all users in the organization
export const fetchUsers = async () => {
  try {
    const response = await apiClient.get("/users");
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

// Fetch all available roles
export const fetchRoles = async () => {
  try {
    const response = await apiClient.get("/roles");
    return response.data;
  } catch (error) {
    console.error("Error fetching roles:", error);
    throw error;
  }
};

// Update a user's role
export const updateUserRole = async (userId: string, roleId: string) => {
  try {
    const response = await apiClient.patch(`/users/${userId}/roles`, {
      role: roleId,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating user role:", error);
    throw error;
  }
};

// API functions for Teams
export const createTeam = async (teamData: object) => {
  try {
    const response = await apiClient.post('/teams', teamData);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error('Error creating team');
  }
};

export const getTeams = async () => {
  try {
    const response = await apiClient.get('/teams');
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error('Error fetching teams');
  }
};

export const getTeam = async (teamId: string) => {
  try {
    const response = await apiClient.get(`/teams/${teamId}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error('Error fetching team');
  }
};

export const updateTeam = async (teamId: string, teamData: object) => {
  try {
    const response = await apiClient.put(`/teams/${teamId}`, teamData);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error('Error updating team');
  }
};

export const deleteTeam = async (teamId: string) => {
  try {
    const response = await apiClient.delete(`/teams/${teamId}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error('Error deleting team');
  }
};

// API functions for Organizations
export const createOrganization = async (organizationData: object) => {
  try {
    const response = await apiClient.post('/organizations', organizationData);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error('Error creating organization');
  }
};

export const getOrganizations = async () => {
  try {
    const response = await apiClient.get('/organizations');
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error('Error fetching organizations');
  }
};

export const getOrganization = async (orgId: string) => {
  try {
    const response = await apiClient.get(`/organizations/${orgId}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error('Error fetching organization');
  }
};

export const updateOrganization = async (
  orgId: string,
  organizationData: object
) => {
  try {
    const response = await apiClient.put(
      `/organizations/${orgId}`,
      organizationData
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error('Error updating organization');
  }
};

export const deleteOrganization = async (orgId: string) => {
  try {
    const response = await apiClient.delete(`/organizations/${orgId}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error('Error deleting organization');
  }
};

// API functions for Services
export const createService = async (serviceData: object) => {
  try {
    const response = await apiClient.post('/services', serviceData);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error('Error creating service');
  }
};

export const getServices = async () => {
  try {
    const response = await apiClient.get('/services');
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error('Error fetching services');
  }
};

export const getService = async (serviceId: string) => {
  try {
    const response = await apiClient.get(`/services/${serviceId}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error('Error fetching service');
  }
};

export const updateService = async (serviceId: string, serviceData: object) => {
  try {
    const response = await apiClient.put(`/services/${serviceId}`, serviceData);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error('Error updating service');
  }
};

export const deleteService = async (serviceId: string) => {
  try {
    const response = await apiClient.delete(`/services/${serviceId}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error('Error deleting service');
  }
};

// API functions for Incidents
export const createIncident = async (incidentData: object) => {
  try {
    const response = await apiClient.post('/incidents', incidentData);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error('Error creating incident');
  }
};

export const getIncidents = async () => {
  try {
    const response = await apiClient.get('/incidents');
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error('Error fetching incidents');
  }
};

export const getIncident = async (incidentId: string) => {
  try {
    const response = await apiClient.get(`/incidents/${incidentId}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error('Error fetching incident');
  }
};

export const updateIncident = async (
  incidentId: string,
  incidentData: object
) => {
  try {
    const response = await apiClient.put(
      `/incidents/${incidentId}`,
      incidentData
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error('Error updating incident');
  }
};

export const deleteIncident = async (incidentId: string) => {
  try {
    const response = await apiClient.delete(`/incidents/${incidentId}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error('Error deleting incident');
  }
};

// API function for WebSocket status updates (no authentication required)
export const getStatusUpdates = async () => {
  try {
    const response = await apiClient.get('/status-updates');
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error('Error fetching status updates');
  }
};

// Public status page
export const getPublicStatus = async () => {
  try {
    const response = await apiClient.get('/status');
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error('Error fetching public status');
  }
};
