import apiClient from '../client.js';
import { ENDPOINTS } from '../endpoints.js';

export const organizationService = {
  // Departments
  departments: {
    list: async (params) => {
      return apiClient.get(ENDPOINTS.ORG_WORKFORCE.DEPARTMENTS.LIST, { params });
    },
    create: async (payload) => {
      return apiClient.post(ENDPOINTS.ORG_WORKFORCE.DEPARTMENTS.CREATE, payload);
    },
    getById: async (id) => {
      return apiClient.get(ENDPOINTS.ORG_WORKFORCE.DEPARTMENTS.GET_BY_ID(id));
    },
    update: async (id, payload) => {
      return apiClient.put(ENDPOINTS.ORG_WORKFORCE.DEPARTMENTS.UPDATE(id), payload);
    },
    delete: async (id) => {
      return apiClient.delete(ENDPOINTS.ORG_WORKFORCE.DEPARTMENTS.DELETE(id));
    },
  },

  // Workforce Roles
  roles: {
    list: async (params) => {
      return apiClient.get(ENDPOINTS.ORG_WORKFORCE.ROLES.LIST, { params });
    },
    create: async (payload) => {
      return apiClient.post(ENDPOINTS.ORG_WORKFORCE.ROLES.CREATE, payload);
    },
    getById: async (id) => {
      return apiClient.get(ENDPOINTS.ORG_WORKFORCE.ROLES.GET_BY_ID(id));
    },
    update: async (id, payload) => {
      return apiClient.put(ENDPOINTS.ORG_WORKFORCE.ROLES.UPDATE(id), payload);
    },
    delete: async (id) => {
      return apiClient.delete(ENDPOINTS.ORG_WORKFORCE.ROLES.DELETE(id));
    },
  },

  // Salary Levels
  levels: {
    list: async (params) => {
      return apiClient.get(ENDPOINTS.ORG_WORKFORCE.LEVELS.LIST, { params });
    },
    create: async (payload) => {
      return apiClient.post(ENDPOINTS.ORG_WORKFORCE.LEVELS.CREATE, payload);
    },
    getById: async (id) => {
      return apiClient.get(ENDPOINTS.ORG_WORKFORCE.LEVELS.GET_BY_ID(id));
    },
    update: async (id, payload) => {
      return apiClient.put(ENDPOINTS.ORG_WORKFORCE.LEVELS.UPDATE(id), payload);
    },
    delete: async (id) => {
      return apiClient.delete(ENDPOINTS.ORG_WORKFORCE.LEVELS.DELETE(id));
    },
  },

  // Staff Roster & Management
  staff: {
    list: async (params = { pageNumber: 1, pageSize: 20 }) => {
      return apiClient.get(ENDPOINTS.ORG_WORKFORCE.STAFF.LIST, { params });
    },
    getById: async (id) => {
      return apiClient.get(ENDPOINTS.ORG_WORKFORCE.STAFF.GET_BY_ID(id));
    },
    createDirect: async (payload) => {
      return apiClient.post(ENDPOINTS.ORG_WORKFORCE.STAFF.CREATE, payload);
    },
    invite: async (payload) => {
      return apiClient.post(ENDPOINTS.ORG_WORKFORCE.STAFF.INVITE, payload);
    },
    inviteBulk: async (payload) => {
      return apiClient.post(ENDPOINTS.ORG_WORKFORCE.STAFF.INVITE_BULK, payload);
    },
    acceptInvite: async (payload) => {
      return apiClient.post(ENDPOINTS.ORG_WORKFORCE.STAFF.ACCEPT_INVITE, payload);
    },
    assign: async (id, payload) => {
      return apiClient.put(ENDPOINTS.ORG_WORKFORCE.STAFF.ASSIGN(id), payload);
    },
    suspend: async (id, payload) => {
      return apiClient.patch(ENDPOINTS.ORG_WORKFORCE.STAFF.SUSPEND(id), payload);
    },
    reactivate: async (id) => {
      return apiClient.patch(ENDPOINTS.ORG_WORKFORCE.STAFF.REACTIVATE(id));
    },
    terminate: async (id, payload) => {
      return apiClient.post(ENDPOINTS.ORG_WORKFORCE.STAFF.TERMINATE(id), payload);
    },
  },
};
