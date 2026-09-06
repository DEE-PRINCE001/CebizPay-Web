import apiClient from '../client.js';
import { ENDPOINTS } from '../endpoints.js';

export const workService = {
  joinOrganization: async (payload) => {
    return apiClient.post(ENDPOINTS.WORK.JOIN_ORGANIZATION, payload);
  },

  // Staff Savings
  savings: {
    preview: async (payload) => {
      return apiClient.post(ENDPOINTS.WORK.SAVINGS.PREVIEW, payload);
    },
    open: async (payload, idempotencyKey = null) => {
      return apiClient.post(ENDPOINTS.WORK.SAVINGS.OPEN, payload, {
        idempotent: true,
        headers: idempotencyKey ? { 'X-Idempotency-Key': idempotencyKey } : {},
      });
    },
    list: async (params) => {
      return apiClient.get(ENDPOINTS.WORK.SAVINGS.LIST, { params });
    },
    getById: async (id) => {
      return apiClient.get(ENDPOINTS.WORK.SAVINGS.GET_BY_ID(id));
    },
    contribute: async (id, payload, idempotencyKey = null) => {
      return apiClient.post(ENDPOINTS.WORK.SAVINGS.CONTRIBUTE(id), payload, {
        idempotent: true,
        headers: idempotencyKey ? { 'X-Idempotency-Key': idempotencyKey } : {},
      });
    },
    previewWithdrawal: async (id, payload) => {
      return apiClient.post(ENDPOINTS.WORK.SAVINGS.WITHDRAW_PREVIEW(id), payload);
    },
    withdraw: async (id, payload, idempotencyKey = null) => {
      return apiClient.post(ENDPOINTS.WORK.SAVINGS.WITHDRAW(id), payload, {
        idempotent: true,
        headers: idempotencyKey ? { 'X-Idempotency-Key': idempotencyKey } : {},
      });
    },
  },

  // Staff Loans
  loans: {
    preview: async (payload) => {
      return apiClient.post(ENDPOINTS.WORK.LOANS.PREVIEW, payload);
    },
    submitApplication: async (payload) => {
      return apiClient.post(ENDPOINTS.WORK.LOANS.APPLICATIONS, payload);
    },
    getApplications: async (params) => {
      return apiClient.get(ENDPOINTS.WORK.LOANS.APPLICATIONS, { params });
    },
    getApplicationById: async (id) => {
      return apiClient.get(ENDPOINTS.WORK.LOANS.APPLICATION_BY_ID(id));
    },
    getContracts: async (params) => {
      return apiClient.get(ENDPOINTS.WORK.LOANS.CONTRACTS, { params });
    },
    getContractById: async (id) => {
      return apiClient.get(ENDPOINTS.WORK.LOANS.CONTRACT_BY_ID(id));
    },
  },

  // Staff Thrift
  thrift: {
    create: async (payload) => {
      return apiClient.post(ENDPOINTS.WORK.THRIFT.CREATE, payload);
    },
    list: async (params) => {
      return apiClient.get(ENDPOINTS.WORK.THRIFT.LIST, { params });
    },
    getById: async (id) => {
      return apiClient.get(ENDPOINTS.WORK.THRIFT.GET_BY_ID(id));
    },
    invite: async (id, payload) => {
      return apiClient.post(ENDPOINTS.WORK.THRIFT.INVITE(id), payload);
    },
    join: async (payload) => {
      return apiClient.post(ENDPOINTS.WORK.THRIFT.JOIN, payload);
    },
    selectPosition: async (id, payload) => {
      return apiClient.post(ENDPOINTS.WORK.THRIFT.SELECT_POSITION(id), payload);
    },
    getMembers: async (id) => {
      return apiClient.get(ENDPOINTS.WORK.THRIFT.MEMBERS(id));
    },
    getCycles: async (id) => {
      return apiClient.get(ENDPOINTS.WORK.THRIFT.CYCLES(id));
    },
    lock: async (id) => {
      return apiClient.post(ENDPOINTS.WORK.THRIFT.LOCK(id));
    },
    leave: async (id, memberId, payload) => {
      return apiClient.post(ENDPOINTS.WORK.THRIFT.LEAVE(id, memberId), payload);
    },
  },
};
