import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import LoadingScreen from '../common/LoadingScreen.jsx';

export const OrgGuard = ({ children, fallbackPath = '/unauthorized' }) => {
  const { hasOrgContext, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen message="Verifying organization context..." />;
  }

  if (!hasOrgContext) {
    return <Navigate to={fallbackPath} replace />;
  }

  return children ? children : <Outlet />;
};
