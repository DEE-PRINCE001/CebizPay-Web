import { useAuth } from './useAuth.js';

export const usePermissions = () => {
  const { user, hasRole, hasPermission, isAdmin, hasOrgContext } = useAuth();

  return {
    user,
    roles: user?.roles || [],
    permissions: user?.permissions || [],
    isAdmin,
    hasOrgContext,
    hasRole,
    hasPermission,
    canAccessAdmin: () => isAdmin,
    canAccessWorkforce: () => hasOrgContext && (isAdmin || hasRole(['Manager', 'WorkforceAdmin', 'OrgAdmin', 'Owner'])),
    canAccessPayroll: () => hasOrgContext && (isAdmin || hasRole(['PayrollManager', 'Accountant', 'OrgAdmin', 'Owner'])),
    canAccessInventory: () => hasOrgContext && (isAdmin || hasRole(['InventoryManager', 'WarehouseAdmin', 'OrgAdmin', 'Owner'])),
  };
};
