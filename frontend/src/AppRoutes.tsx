import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoadingSpinner from './components/common/LoadingSpinner';
import PublicStatusPage from './components/status/PublicStatusPage';
import ServiceManagementPage from './pages/ServiceManagementPage';
import IncidentManagementPage from './pages/IncidentManagementPage';
import TeamManagementPage from './pages/TeamManagementPage';
import UserManagementPage from './pages/UserManagementPage';
import AccountSettings from './pages/AccountSettings';

const AppRoutes: React.FC = () => {
  const { isLoading } = useAuth0();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Routes>
      <Route path='/' element={<PublicStatusPage />} />
      <Route path='/login' element={<LoginPage />} />

      <Route
        path='/dashboard'
        element={
          <ProtectedRoute roles={['admin', 'user']}>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path='/services'
        element={
          <ProtectedRoute roles={['admin']}>
            <ServiceManagementPage />
          </ProtectedRoute>
        }
      />
      <Route
        path='/incidents'
        element={
          <ProtectedRoute roles={['admin']}>
            <IncidentManagementPage />
          </ProtectedRoute>
        }
      />
      <Route
        path='/teams'
        element={
          <ProtectedRoute roles={['admin']}>
            <TeamManagementPage />
          </ProtectedRoute>
        }
      />
      <Route
        path='/users'
        element={
          <ProtectedRoute roles={['admin']}>
            <UserManagementPage />
          </ProtectedRoute>
        }
      />
      <Route
        path='/settings'
        element={
          <ProtectedRoute roles={['admin']}>
            <AccountSettings />
          </ProtectedRoute>
        }
      />
      <Route path='*' element={<div>Page Not Found</div>} />
    </Routes>
  );
};

export default AppRoutes;
