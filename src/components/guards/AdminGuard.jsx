import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import LoadingScreen from '../common/LoadingScreen.jsx';

export const AdminGuard = ({ children, fallbackPath = '/unauthorized' }) => {
  const { isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen message="Checking admin privileges..." />;
  }

  if (!isAdmin) {
    return <Navigate to={fallbackPath} replace />;
  }

  return children ? children : <Outlet />;
};
