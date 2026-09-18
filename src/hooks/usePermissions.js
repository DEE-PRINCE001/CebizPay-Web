import { useAuth } from './useAuth.js';
import { MembershipRoleType, AdminRoleType } from '../data/enums.js';

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
    canAccessWorkforce: () =>
      hasOrgContext &&
      (isAdmin ||
        hasRole([
          MembershipRoleType.Owner,
          MembershipRoleType.Admin,
          MembershipRoleType.HrManager,
          'Manager',
          'WorkforceAdmin',
          'OrgAdmin',
        ])),
    canAccessPayroll: () =>
      hasOrgContext &&
      (isAdmin ||
        hasRole([
          MembershipRoleType.Owner,
          MembershipRoleType.Admin,
          MembershipRoleType.PayrollManager,
          'Accountant',
          'OrgAdmin',
        ])),
    canAccessInventory: () =>
      hasOrgContext &&
      (isAdmin ||
        hasRole([
          MembershipRoleType.Owner,
          MembershipRoleType.Admin,
          'InventoryManager',
          'WarehouseAdmin',
          'OrgAdmin',
        ])),
  };
};
