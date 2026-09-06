import { useAuth } from './useAuth.js';

export const usePermissions = () => {
  const { user, activeOrg, hasRole, hasPermission, isAdmin, hasOrgContext } = useAuth();

  const orgPermissions = activeOrg?.permissions || [];
  const adminPermissions = user?.adminProfile?.permissions || [];
  const allPermissions = Array.from(new Set([...adminPermissions, ...orgPermissions]));

  const orgRole = activeOrg?.role;
  const adminRole = user?.adminProfile?.role;
  const allRoles = [adminRole, orgRole].filter(Boolean);

  return {
    user,
    activeOrg,
    roles: allRoles,
    permissions: allPermissions,
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
