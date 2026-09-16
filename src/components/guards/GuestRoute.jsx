import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import LoadingScreen from '../common/LoadingScreen.jsx';

export const GuestRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, hasOrgContext, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen message="Checking session..." />;
  }

  if (isAuthenticated) {
    if (isAdmin) return <Navigate to="/dashboard" replace />;
    if (hasOrgContext) return <Navigate to="/org/dashboard" replace />;
    return <Navigate to="/register/business" replace />;
  }

  return children ? children : <Outlet />;
};
