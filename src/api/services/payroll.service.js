import apiClient from '../client.js';
import { ENDPOINTS } from '../endpoints.js';

export const payrollService = {
  preview: async (payload) => {
    return apiClient.post(ENDPOINTS.ORG_PAYROLL.PREVIEW, payload);
  },

  execute: async (payload, idempotencyKey = null) => {
    return apiClient.post(ENDPOINTS.ORG_PAYROLL.EXECUTE, payload, {
      idempotent: true,
      headers: idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {},
    });
  },

  getBatches: async (params = { pageNumber: 1, pageSize: 20 }) => {
    return apiClient.get(ENDPOINTS.ORG_PAYROLL.BATCHES, { params });
  },

  getBatchById: async (id) => {
    return apiClient.get(ENDPOINTS.ORG_PAYROLL.BATCH_BY_ID(id));
  },

  cancelBatch: async (batchId) => {
    return apiClient.post(ENDPOINTS.ORG_PAYROLL.CANCEL_BATCH(batchId));
  },

  getVoucherById: async (id) => {
    return apiClient.get(ENDPOINTS.ORG_PAYROLL.VOUCHER_BY_ID(id));
  },

  updateVoucher: async (id, payload) => {
    return apiClient.put(ENDPOINTS.ORG_PAYROLL.UPDATE_VOUCHER(id), payload);
  },

  getAdminBatchById: async (id) => {
    return apiClient.get(ENDPOINTS.ADMIN.PAYROLL.BATCH_BY_ID(id));
  },
};
