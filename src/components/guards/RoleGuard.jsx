import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import LoadingScreen from '../common/LoadingScreen.jsx';

export const RoleGuard = ({ roles = [], children, fallbackPath = '/unauthorized' }) => {
  const { hasRole, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen message="Verifying permissions..." />;
  }

  if (!hasRole(roles)) {
    return <Navigate to={fallbackPath} replace />;
  }

  return children ? children : <Outlet />;
};
