import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';

/**
 * Route guard that requires the user to have an active organization context.
 * If user is purely an individual, redirects them to their dashboard or onboarding.
 */
export const OrgGuard = ({ children, fallbackPath = '/dashboard' }) => {
  const { hasOrgContext, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!hasOrgContext) {
    return <Navigate to={fallbackPath} replace />;
  }

  return children ? children : <Outlet />;
};
