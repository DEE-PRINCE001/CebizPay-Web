import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import LoadingScreen from '../common/LoadingScreen.jsx';

export const KycGuard = ({ children, fallbackPath = '/unauthorized' }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen message="Checking verification status..." />;
  }

  const isVerified =
    user?.kycStatus === 'Verified' ||
    user?.kycStatus === 'Approved' ||
    user?.kycStatus === 1;

  if (!isVerified) {
    return <Navigate to={fallbackPath} replace />;
  }

  return children ? children : <Outlet />;
};
