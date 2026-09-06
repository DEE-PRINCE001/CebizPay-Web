import apiClient from '../client.js';
import { ENDPOINTS } from '../endpoints.js';

export const organizationService = {
  // Departments
  getDepartments: async (params) => {
    return apiClient.get(ENDPOINTS.ORGANIZATION.DEPARTMENTS.LIST, { params });
  },

  createDepartment: async (payload) => {
    return apiClient.post(ENDPOINTS.ORGANIZATION.DEPARTMENTS.CREATE, payload);
  },

  getDepartmentById: async (id) => {
    return apiClient.get(ENDPOINTS.ORGANIZATION.DEPARTMENTS.GET_BY_ID(id));
  },

  updateDepartment: async (id, payload) => {
    return apiClient.put(ENDPOINTS.ORGANIZATION.DEPARTMENTS.UPDATE(id), payload);
  },

  deleteDepartment: async (id) => {
    return apiClient.delete(ENDPOINTS.ORGANIZATION.DEPARTMENTS.DELETE(id));
  },

  // Workforce Roles
  getRoles: async (params) => {
    return apiClient.get(ENDPOINTS.ORGANIZATION.WORKFORCE_ROLES.LIST, { params });
  },

  createRole: async (payload) => {
    return apiClient.post(ENDPOINTS.ORGANIZATION.WORKFORCE_ROLES.CREATE, payload);
  },

  getRoleById: async (id) => {
    return apiClient.get(ENDPOINTS.ORGANIZATION.WORKFORCE_ROLES.GET_BY_ID(id));
  },

  updateRole: async (id, payload) => {
    return apiClient.put(ENDPOINTS.ORGANIZATION.WORKFORCE_ROLES.UPDATE(id), payload);
  },

  deleteRole: async (id) => {
    return apiClient.delete(ENDPOINTS.ORGANIZATION.WORKFORCE_ROLES.DELETE(id));
  },

  // Salary Levels
  getSalaryLevels: async (params) => {
    return apiClient.get(ENDPOINTS.ORGANIZATION.SALARY_LEVELS.LIST, { params });
  },

  createSalaryLevel: async (payload) => {
    return apiClient.post(ENDPOINTS.ORGANIZATION.SALARY_LEVELS.CREATE, payload);
  },

  getSalaryLevelById: async (id) => {
    return apiClient.get(ENDPOINTS.ORGANIZATION.SALARY_LEVELS.GET_BY_ID(id));
  },

  updateSalaryLevel: async (id, payload) => {
    return apiClient.put(ENDPOINTS.ORGANIZATION.SALARY_LEVELS.UPDATE(id), payload);
  },

  deleteSalaryLevel: async (id) => {
    return apiClient.delete(ENDPOINTS.ORGANIZATION.SALARY_LEVELS.DELETE(id));
  },

  // Staff Management
  getStaffRoster: async (params = { pageNumber: 1, pageSize: 20 }) => {
    return apiClient.get(ENDPOINTS.ORGANIZATION.STAFF.LIST, { params });
  },

  getStaffById: async (id) => {
    return apiClient.get(ENDPOINTS.ORGANIZATION.STAFF.GET_BY_ID(id));
  },

  createStaffDirect: async (payload) => {
    return apiClient.post(ENDPOINTS.ORGANIZATION.STAFF.CREATE_DIRECT, payload);
  },

  inviteStaff: async (payload) => {
    return apiClient.post(ENDPOINTS.ORGANIZATION.STAFF.INVITE, payload);
  },

  inviteStaffBulk: async (payload) => {
    return apiClient.post(ENDPOINTS.ORGANIZATION.STAFF.INVITE_BULK, payload);
  },

  acceptStaffInvitation: async (payload) => {
    return apiClient.post(ENDPOINTS.ORGANIZATION.STAFF.ACCEPT_INVITATION, payload);
  },

  assignStaffWorkforce: async (id, payload) => {
    return apiClient.put(ENDPOINTS.ORGANIZATION.STAFF.ASSIGN_WORKFORCE(id), payload);
  },

  suspendStaff: async (id, payload) => {
    return apiClient.post(ENDPOINTS.ORGANIZATION.STAFF.SUSPEND(id), payload);
  },

  terminateStaff: async (id, payload) => {
    return apiClient.post(ENDPOINTS.ORGANIZATION.STAFF.TERMINATE(id), payload);
  },
};
