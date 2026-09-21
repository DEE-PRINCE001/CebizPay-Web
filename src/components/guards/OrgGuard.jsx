import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { MembershipRoleType } from '../../data/enums.js';
import LoadingScreen from '../common/LoadingScreen.jsx';

export const OrgGuard = ({ children, fallbackPath = '/unauthorized' }) => {
  const { hasOrgContext, activeOrg, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen message="Verifying organization context..." />;
  }

  if (!hasOrgContext) {
    return <Navigate to={fallbackPath} replace />;
  }

  const isManager =
    isAdmin ||
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

  if (!isManager) {
    return <Navigate to={fallbackPath} replace />;
  }

  return children ? children : <Outlet />;
};
