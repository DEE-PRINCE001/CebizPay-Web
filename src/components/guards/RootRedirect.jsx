import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import LoadingScreen from '../common/LoadingScreen.jsx';

export const RootRedirect = () => {
  const { isAuthenticated, isAdmin, hasOrgContext, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen message="Redirecting to your workspace..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  if (hasOrgContext) {
    return <Navigate to="/org/dashboard" replace />;
  }

  return <Navigate to="/register/business" replace />;
};
