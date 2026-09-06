import apiClient from '../client.js';
import { ENDPOINTS } from '../endpoints.js';

export const loansService = {
  // Individual Loans
  getPlans: async (params) => {
    return apiClient.get(ENDPOINTS.LOANS.PLANS, { params });
  },

  calculatePreview: async (payload) => {
    return apiClient.post(ENDPOINTS.LOANS.CALCULATE_PREVIEW, payload);
  },

  submitApplication: async (payload) => {
    return apiClient.post(ENDPOINTS.LOANS.SUBMIT_APPLICATION, payload);
  },

  getApplications: async (params) => {
    return apiClient.get(ENDPOINTS.LOANS.APPLICATIONS, { params });
  },

  getApplicationById: async (id) => {
    return apiClient.get(ENDPOINTS.LOANS.APPLICATION_BY_ID(id));
  },

  getContracts: async (params) => {
    return apiClient.get(ENDPOINTS.LOANS.CONTRACTS, { params });
  },

  getContractById: async (id) => {
    return apiClient.get(ENDPOINTS.LOANS.CONTRACT_BY_ID(id));
  },

  getRepaymentSchedule: async (contractId) => {
    return apiClient.get(ENDPOINTS.LOANS.REPAYMENT_SCHEDULE(contractId));
  },

  // Staff Loans
  getStaffPlans: async (organizationId = null) => {
    return apiClient.get(ENDPOINTS.LOANS.STAFF_LOANS.PLANS, {
      params: organizationId ? { organizationId } : {},
    });
  },

  getStaffApplications: async (organizationId = null) => {
    return apiClient.get(ENDPOINTS.LOANS.STAFF_LOANS.APPLICATIONS, {
      params: organizationId ? { organizationId } : {},
    });
  },

  submitStaffApplication: async (payload) => {
    return apiClient.post(ENDPOINTS.LOANS.STAFF_LOANS.SUBMIT, payload);
  },

  convertStaffLoans: async (payload) => {
    return apiClient.post(ENDPOINTS.LOANS.STAFF_LOANS.CONVERT, payload);
  },

  // Corporate / Org Loans
  getCorporatePlans: async (organizationId = null) => {
    return apiClient.get(ENDPOINTS.LOANS.ORG_LOANS.CORPORATE_PLANS, {
      params: organizationId ? { organizationId } : {},
    });
  },

  createCorporatePlan: async (payload) => {
    return apiClient.post(ENDPOINTS.LOANS.ORG_LOANS.CREATE_CORPORATE_PLAN, payload);
  },

  getOrgApplications: async (organizationId = null) => {
    return apiClient.get(ENDPOINTS.LOANS.ORG_LOANS.APPLICATIONS, {
      params: organizationId ? { organizationId } : {},
    });
  },

  approveOrgLoanApplication: async (id) => {
    return apiClient.post(ENDPOINTS.LOANS.ORG_LOANS.APPROVE_APPLICATION(id));
  },

  declineOrgLoanApplication: async (id, payload) => {
    return apiClient.post(ENDPOINTS.LOANS.ORG_LOANS.DECLINE_APPLICATION(id), payload);
  },
};
