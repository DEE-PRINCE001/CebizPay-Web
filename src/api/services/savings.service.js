import apiClient from '../client.js';
import { ENDPOINTS } from '../endpoints.js';

export const savingsService = {
  // Individual Savings
  getPlans: async (params) => {
    return apiClient.get(ENDPOINTS.SAVINGS.PLANS, { params });
  },

  getPlanById: async (id) => {
    return apiClient.get(ENDPOINTS.SAVINGS.PLAN_BY_ID(id));
  },

  previewSavings: async (payload) => {
    return apiClient.post(ENDPOINTS.SAVINGS.PREVIEW, payload);
  },

  openAccount: async (payload) => {
    return apiClient.post(ENDPOINTS.SAVINGS.OPEN_ACCOUNT, payload);
  },

  getAccounts: async (params) => {
    return apiClient.get(ENDPOINTS.SAVINGS.GET_ACCOUNTS, { params });
  },

  getAccountById: async (id) => {
    return apiClient.get(ENDPOINTS.SAVINGS.ACCOUNT_BY_ID(id));
  },

  contribute: async (accountId, payload, idempotencyKey = null) => {
    return apiClient.post(ENDPOINTS.SAVINGS.CONTRIBUTE(accountId), payload, {
      idempotent: true,
      headers: idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {},
    });
  },

  withdraw: async (accountId, payload, idempotencyKey = null) => {
    return apiClient.post(ENDPOINTS.SAVINGS.WITHDRAW(accountId), payload, {
      idempotent: true,
      headers: idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {},
    });
  },

  // Staff Savings
  getStaffPlans: async (organizationId = null) => {
    return apiClient.get(ENDPOINTS.SAVINGS.STAFF_SAVINGS.PLANS, {
      params: organizationId ? { organizationId } : {},
    });
  },

  getStaffAccounts: async (organizationId = null) => {
    return apiClient.get(ENDPOINTS.SAVINGS.STAFF_SAVINGS.ACCOUNTS, {
      params: organizationId ? { organizationId } : {},
    });
  },

  openStaffAccount: async (payload) => {
    return apiClient.post(ENDPOINTS.SAVINGS.STAFF_SAVINGS.OPEN, payload);
  },

  contributeStaffAccount: async (accountId, payload, idempotencyKey = null) => {
    return apiClient.post(ENDPOINTS.SAVINGS.STAFF_SAVINGS.CONTRIBUTE(accountId), payload, {
      idempotent: true,
      headers: idempotencyKey ? { 'X-Idempotency-Key': idempotencyKey } : {},
    });
  },

  withdrawStaffAccount: async (accountId, payload, idempotencyKey = null) => {
    return apiClient.post(ENDPOINTS.SAVINGS.STAFF_SAVINGS.WITHDRAW(accountId), payload, {
      idempotent: true,
      headers: idempotencyKey ? { 'X-Idempotency-Key': idempotencyKey } : {},
    });
  },

  // Organization Savings
  getOrgPlans: async (organizationId = null) => {
    return apiClient.get(ENDPOINTS.SAVINGS.ORG_SAVINGS.PLANS, {
      params: organizationId ? { organizationId } : {},
    });
  },

  createOrgPlan: async (payload) => {
    return apiClient.post(ENDPOINTS.SAVINGS.ORG_SAVINGS.CREATE_PLAN, payload);
  },

  getOrgAccounts: async (organizationId = null) => {
    return apiClient.get(ENDPOINTS.SAVINGS.ORG_SAVINGS.ACCOUNTS, {
      params: organizationId ? { organizationId } : {},
    });
  },
};
