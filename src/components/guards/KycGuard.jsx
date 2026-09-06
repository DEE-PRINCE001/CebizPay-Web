import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';

/**
 * Route guard that requires a minimum KYC verification status.
 */
export const KycGuard = ({ children, fallbackPath = '/kyc/verify' }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null;
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
