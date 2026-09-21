import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { MembershipRoleType } from '../../data/enums.js';
import LoadingScreen from '../common/LoadingScreen.jsx';

export const RootRedirect = () => {
  const { isAuthenticated, isAdmin, hasOrgContext, activeOrg, isLoading } = useAuth();

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
    const isManager =
      activeOrg?.role === MembershipRoleType.Owner ||
      activeOrg?.role === MembershipRoleType.Admin ||
      activeOrg?.role === MembershipRoleType.PayrollManager ||
      activeOrg?.role === MembershipRoleType.HrManager ||
      activeOrg?.role === 1 ||
      activeOrg?.role === 2 ||
      activeOrg?.role === 4 ||
      activeOrg?.role === 5 ||
      activeOrg?.role === 'Owner' ||
      activeOrg?.role === 'Admin' ||
      activeOrg?.role === 'PayrollManager' ||
      activeOrg?.role === 'HrManager' ||
      activeOrg?.role === 'Manager' ||
      activeOrg?.role === 'OrgAdmin';

    if (isManager) {
      return <Navigate to="/org/dashboard" replace />;
    }
    return <Navigate to="/unauthorized" replace />;
  }

  return <Navigate to="/register/business" replace />;
};
