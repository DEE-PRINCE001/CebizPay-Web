import apiClient from '../client.js';
import { ENDPOINTS } from '../endpoints.js';

export const payrollService = {
  calculatePayroll: async (payload) => {
    return apiClient.post(ENDPOINTS.PAYROLL.CALCULATE, payload);
  },

  executePayroll: async (payload, idempotencyKey = null) => {
    return apiClient.post(ENDPOINTS.PAYROLL.EXECUTE, payload, {
      idempotent: true,
      headers: idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {},
    });
  },

  getPayrollRuns: async (params = { pageNumber: 1, pageSize: 20 }) => {
    return apiClient.get(ENDPOINTS.PAYROLL.RUNS, { params });
  },

  getPayrollRunById: async (id) => {
    return apiClient.get(ENDPOINTS.PAYROLL.RUN_BY_ID(id));
  },

  getPayrollReports: async (params) => {
    return apiClient.get(ENDPOINTS.PAYROLL.REPORTS, { params });
  },
};
