import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';

/**
 * Route guard that requires one or more specific roles.
 */
export const RoleGuard = ({ roles = [], children, fallbackPath = '/unauthorized' }) => {
  const { hasRole, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!hasRole(roles)) {
    return <Navigate to={fallbackPath} replace />;
  }

  return children ? children : <Outlet />;
};
