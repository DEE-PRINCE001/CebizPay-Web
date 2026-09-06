import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';

/**
 * Route guard strictly ensuring only Platform Admins and Compliance Officers can access.
 */
export const AdminGuard = ({ children, fallbackPath = '/dashboard' }) => {
  const { isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!isAdmin) {
    return <Navigate to={fallbackPath} replace />;
  }

  return children ? children : <Outlet />;
};
