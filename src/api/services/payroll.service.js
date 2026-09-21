import apiClient from '../client.js';
import { ENDPOINTS } from '../endpoints.js';

export const payrollService = {
  preview: async (payload) => {
    return apiClient.post(ENDPOINTS.ORGANIZATION.PAYROLL.PREVIEW, payload);
  },

  calculate: async (payload) => {
    return apiClient.post(ENDPOINTS.ORGANIZATION.PAYROLL.CALCULATE, payload);
  },

  execute: async (payload, idempotencyKey = null) => {
    return apiClient.post(ENDPOINTS.ORGANIZATION.PAYROLL.EXECUTE, payload, {
      idempotent: true,
      headers: idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {},
    });
  },

  getBatches: async (params = { pageNumber: 1, pageSize: 20 }) => {
    return apiClient.get(ENDPOINTS.ORGANIZATION.PAYROLL.BATCHES, { params });
  },

  getBatchById: async (id) => {
    return apiClient.get(ENDPOINTS.ORGANIZATION.PAYROLL.BATCH_BY_ID(id));
  },

  retryFailed: async (batchId) => {
    return apiClient.post(ENDPOINTS.ORGANIZATION.PAYROLL.RETRY_FAILED(batchId));
  },

  cancelBatch: async (batchId) => {
    return apiClient.post(ENDPOINTS.ORGANIZATION.PAYROLL.CANCEL_BATCH(batchId));
  },

  getVoucherById: async (id) => {
    return apiClient.get(ENDPOINTS.ORGANIZATION.PAYROLL.VOUCHERS(id));
  },

  updateVoucher: async (id, payload) => {
    return apiClient.put(ENDPOINTS.ORGANIZATION.PAYROLL.UPDATE_VOUCHER(id), payload);
  },

  getAdminBatchById: async (id) => {
    return apiClient.get(ENDPOINTS.ADMIN.PAYROLL.BATCH_BY_ID(id));
  },

  getAnalytics: async (params = {}) => {
    return apiClient.get(ENDPOINTS.ORGANIZATION.PAYROLL.ANALYTICS, { params });
  },
};
