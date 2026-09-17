import apiClient from '../client.js';
import { ENDPOINTS } from '../endpoints.js';

export const organizationService = {
  // Departments
  departments: {
    list: async (params) => {
      return apiClient.get(ENDPOINTS.ORGANIZATION.DEPARTMENTS.LIST, { params });
    },
    create: async (payload) => {
      return apiClient.post(ENDPOINTS.ORGANIZATION.DEPARTMENTS.CREATE, payload);
    },
    getById: async (id) => {
      return apiClient.get(ENDPOINTS.ORGANIZATION.DEPARTMENTS.GET_BY_ID(id));
    },
    update: async (id, payload) => {
      return apiClient.put(ENDPOINTS.ORGANIZATION.DEPARTMENTS.UPDATE(id), payload);
    },
    delete: async (id) => {
      return apiClient.delete(ENDPOINTS.ORGANIZATION.DEPARTMENTS.DELETE(id));
    },
  },

  // Workforce Roles
  roles: {
    list: async (params) => {
      return apiClient.get(ENDPOINTS.ORGANIZATION.ROLES.LIST, { params });
    },
    create: async (payload) => {
      return apiClient.post(ENDPOINTS.ORGANIZATION.ROLES.CREATE, payload);
    },
    getById: async (id) => {
      return apiClient.get(ENDPOINTS.ORGANIZATION.ROLES.GET_BY_ID(id));
    },
    update: async (id, payload) => {
      return apiClient.put(ENDPOINTS.ORGANIZATION.ROLES.UPDATE(id), payload);
    },
    delete: async (id) => {
      return apiClient.delete(ENDPOINTS.ORGANIZATION.ROLES.DELETE(id));
    },
  },

  // Salary Levels
  levels: {
    list: async (params) => {
      return apiClient.get(ENDPOINTS.ORGANIZATION.LEVELS.LIST, { params });
    },
    create: async (payload) => {
      return apiClient.post(ENDPOINTS.ORGANIZATION.LEVELS.CREATE, payload);
    },
    getById: async (id) => {
      return apiClient.get(ENDPOINTS.ORGANIZATION.LEVELS.GET_BY_ID(id));
    },
    update: async (id, payload) => {
      return apiClient.put(ENDPOINTS.ORGANIZATION.LEVELS.UPDATE(id), payload);
    },
    delete: async (id) => {
      return apiClient.delete(ENDPOINTS.ORGANIZATION.LEVELS.DELETE(id));
    },
  },

  // Staff Roster & Management
  staff: {
    list: async (params = { pageNumber: 1, pageSize: 20 }) => {
      return apiClient.get(ENDPOINTS.ORGANIZATION.STAFF.LIST, { params });
    },
    getById: async (id) => {
      return apiClient.get(ENDPOINTS.ORGANIZATION.STAFF.GET_BY_ID(id));
    },
    createDirect: async (payload) => {
      return apiClient.post(ENDPOINTS.ORGANIZATION.STAFF.CREATE, payload);
    },
    invite: async (payload) => {
      return apiClient.post(ENDPOINTS.ORGANIZATION.STAFF.INVITE, payload);
    },
    inviteBulk: async (payload) => {
      return apiClient.post(ENDPOINTS.ORGANIZATION.STAFF.INVITE_BULK, payload);
    },
    acceptInvite: async (payload) => {
      return apiClient.post(ENDPOINTS.ORGANIZATION.STAFF.ACCEPT_INVITE, payload);
    },
    assign: async (id, payload) => {
      return apiClient.put(ENDPOINTS.ORGANIZATION.STAFF.ASSIGN(id), payload);
    },
    suspend: async (id, payload) => {
      return apiClient.patch(ENDPOINTS.ORGANIZATION.STAFF.SUSPEND(id), payload);
    },
    reactivate: async (id) => {
      return apiClient.patch(ENDPOINTS.ORGANIZATION.STAFF.REACTIVATE(id));
    },
    terminate: async (id, payload) => {
      return apiClient.post(ENDPOINTS.ORGANIZATION.STAFF.TERMINATE(id), payload);
    },
    getSalaries: async (id, params = { pageNumber: 1, pageSize: 20 }) => {
      return apiClient.get(ENDPOINTS.ORGANIZATION.STAFF.SALARIES(id), { params });
    },
    getSavings: async (id, params = { pageNumber: 1, pageSize: 20 }) => {
      return apiClient.get(ENDPOINTS.ORGANIZATION.STAFF.SAVINGS(id), { params });
    },
  },

  // Organization Administrators Directory
  getAdmins: async () => {
    return apiClient.get(ENDPOINTS.ORGANIZATION.ADMINS);
  },

  // Organization Profile & KYB Documents
  getProfile: async () => {
    return apiClient.get(ENDPOINTS.ORGANIZATION.PROFILE);
  },

  // Savings Plans
  savings: {
    listPlans: async (params = {}) => {
      return apiClient.get(ENDPOINTS.ORGANIZATION.SAVINGS.PLANS, { params });
    },
    createPlan: async (payload) => {
      return apiClient.post(ENDPOINTS.ORGANIZATION.SAVINGS.PLANS, payload);
    },
    getPlanById: async (id) => {
      return apiClient.get(ENDPOINTS.ORGANIZATION.SAVINGS.PLAN_BY_ID(id));
    },
    getParticipants: async (id, params = {}) => {
      return apiClient.get(ENDPOINTS.ORGANIZATION.SAVINGS.PARTICIPANTS(id), { params });
    },
  },

  // Corporate Loans
  loans: {
    listPlans: async (params = {}) => {
      return apiClient.get(ENDPOINTS.ORGANIZATION.LOANS.PLANS, { params });
    },
    createPlan: async (payload) => {
      return apiClient.post(ENDPOINTS.ORGANIZATION.LOANS.PLANS, payload);
    },
    getPlanById: async (id) => {
      return apiClient.get(ENDPOINTS.ORGANIZATION.LOANS.PLAN_BY_ID(id));
    },
    listApplications: async (params = {}) => {
      return apiClient.get(ENDPOINTS.ORGANIZATION.LOANS.APPLICATIONS, { params });
    },
    getApplicationById: async (id) => {
      return apiClient.get(ENDPOINTS.ORGANIZATION.LOANS.APPLICATION_BY_ID(id));
    },
    approveApplication: async (id, payload = {}) => {
      return apiClient.post(ENDPOINTS.ORGANIZATION.LOANS.APPROVE_APPLICATION(id), payload);
    },
    declineApplication: async (id, payload = {}) => {
      return apiClient.post(ENDPOINTS.ORGANIZATION.LOANS.DECLINE_APPLICATION(id), payload);
    },
    listContracts: async (params = {}) => {
      return apiClient.get(ENDPOINTS.ORGANIZATION.LOANS.CONTRACTS, { params });
    },
    getContractById: async (id) => {
      return apiClient.get(ENDPOINTS.ORGANIZATION.LOANS.CONTRACT_BY_ID(id));
    },
  },
};

