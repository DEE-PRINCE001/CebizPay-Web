import apiClient from '../client.js';
import { ENDPOINTS } from '../endpoints.js';

export const adminService = {
  // Organizations Directory & Management
  organizations: {
    list: async (params = { pageNumber: 1, pageSize: 20, search: '', status: '' }) => {
      return apiClient.get(ENDPOINTS.ADMIN.ORGANIZATIONS.LIST, { params });
    },
    getById: async (id) => {
      return apiClient.get(ENDPOINTS.ADMIN.ORGANIZATIONS.GET_BY_ID(id));
    },
    updateStatus: async (id, payload) => {
      return apiClient.patch(ENDPOINTS.ADMIN.ORGANIZATIONS.UPDATE_STATUS(id), payload);
    },
    reviewKyb: async (payload) => {
      return apiClient.post(ENDPOINTS.ADMIN.ORGANIZATIONS.REVIEW_KYB, payload);
    },
    getPayrollAnalytics: async (id) => {
      return apiClient.get(ENDPOINTS.ADMIN.ORGANIZATIONS.PAYROLL_ANALYTICS(id));
    },
    getStaff: async (id, params = { pageNumber: 1, pageSize: 10, search: '' }) => {
      return apiClient.get(ENDPOINTS.ADMIN.ORGANIZATIONS.STAFF(id), { params });
    },
    getDocuments: async (id) => {
      return apiClient.get(ENDPOINTS.ADMIN.ORGANIZATIONS.DOCUMENTS(id));
    },
  },

  // Dashboard & Metrics
  dashboard: {
    getMetrics: async () => {
      return apiClient.get(ENDPOINTS.ADMIN.DASHBOARD.METRICS);
    },
  },

  // Treasury & Platform Master Wallet
  treasury: {
    getSummary: async (params = {}) => {
      return apiClient.get(ENDPOINTS.ADMIN.TREASURY.SUMMARY, { params });
    },
  },

  // Analytics & Revenue
  analytics: {
    getRevenue: async (params = { year: new Date().getFullYear() }) => {
      return apiClient.get(ENDPOINTS.ADMIN.ANALYTICS.REVENUE, { params });
    },
  },

  // Audit Logs
  getAuditLogs: async (params = { pageNumber: 1, pageSize: 20 }) => {
    return apiClient.get(ENDPOINTS.ADMIN.AUDIT_LOGS, { params });
  },

  // Compliance Assessments & EDD
  compliance: {
    getAssessment: async (subjectType, subjectId, organizationId = null) => {
      return apiClient.get(ENDPOINTS.ADMIN.COMPLIANCE.ASSESSMENT(subjectType, subjectId), {
        params: organizationId ? { organizationId } : {},
      });
    },
    getAssessmentHistory: async (subjectType, subjectId) => {
      return apiClient.get(ENDPOINTS.ADMIN.COMPLIANCE.ASSESSMENT_HISTORY(subjectType, subjectId));
    },
    evaluateRisk: async (payload) => {
      return apiClient.post(ENDPOINTS.ADMIN.COMPLIANCE.EVALUATE_RISK, payload);
    },
    getEddCases: async (params = { pageNumber: 1, pageSize: 20 }) => {
      return apiClient.get(ENDPOINTS.ADMIN.COMPLIANCE.EDD_CASES, { params });
    },
    getEddCaseById: async (id) => {
      return apiClient.get(ENDPOINTS.ADMIN.COMPLIANCE.EDD_CASE_BY_ID(id));
    },
    requestEddInfo: async (id, payload) => {
      return apiClient.post(ENDPOINTS.ADMIN.COMPLIANCE.REQUEST_EDD_INFO(id), payload);
    },
    assignEddReviewer: async (id, payload) => {
      return apiClient.post(ENDPOINTS.ADMIN.COMPLIANCE.ASSIGN_EDD_REVIEWER(id), payload);
    },
    approveEddCase: async (id, payload) => {
      return apiClient.post(ENDPOINTS.ADMIN.COMPLIANCE.APPROVE_EDD(id), payload);
    },
    rejectEddCase: async (id, payload) => {
      return apiClient.post(ENDPOINTS.ADMIN.COMPLIANCE.REJECT_EDD(id), payload);
    },
    placeRestriction: async (payload) => {
      return apiClient.post(ENDPOINTS.ADMIN.COMPLIANCE.PLACE_RESTRICTION, payload);
    },
    releaseRestriction: async (id, payload) => {
      return apiClient.post(ENDPOINTS.ADMIN.COMPLIANCE.RELEASE_RESTRICTION(id), payload);
    },
    applyOverride: async (payload) => {
      return apiClient.post(ENDPOINTS.ADMIN.COMPLIANCE.APPLY_OVERRIDE, payload);
    },
  },

  // Admin Management & Permissions
  manage: {
    getAdmins: async (params = { pageNumber: 1, pageSize: 20 }) => {
      return apiClient.get(ENDPOINTS.ADMIN.MANAGE.ADMINS, { params });
    },
    inviteAdmin: async (payload) => {
      return apiClient.post(ENDPOINTS.ADMIN.MANAGE.INVITE, payload);
    },
    toggleStatus: async (payload) => {
      return apiClient.patch(ENDPOINTS.ADMIN.MANAGE.TOGGLE_STATUS, payload);
    },
    deleteAdmin: async (id) => {
      return apiClient.delete(ENDPOINTS.ADMIN.MANAGE.DELETE(id));
    },
    grantPermission: async (id, payload) => {
      return apiClient.post(ENDPOINTS.ADMIN.MANAGE.GRANT_PERMISSION(id), payload);
    },
    revokePermission: async (id, payload) => {
      return apiClient.post(ENDPOINTS.ADMIN.MANAGE.REVOKE_PERMISSION(id), payload);
    },
  },

  // Fees Policies
  fees: {
    getPolicies: async (params) => {
      return apiClient.get(ENDPOINTS.ADMIN.FEES.POLICIES, { params });
    },
    getPolicyById: async (id) => {
      return apiClient.get(ENDPOINTS.ADMIN.FEES.POLICY_BY_ID(id));
    },
    createPolicy: async (payload) => {
      return apiClient.post(ENDPOINTS.ADMIN.FEES.POLICIES, payload);
    },
    updatePolicy: async (id, payload) => {
      return apiClient.put(ENDPOINTS.ADMIN.FEES.POLICY_BY_ID(id), payload);
    },
    deletePolicy: async (id) => {
      return apiClient.delete(ENDPOINTS.ADMIN.FEES.POLICY_BY_ID(id));
    },
    getPlatformPolicies: async (params) => {
      return apiClient.get(ENDPOINTS.ADMIN.FEES.PLATFORM_POLICIES, { params });
    },
    createPlatformPolicy: async (payload) => {
      return apiClient.post(ENDPOINTS.ADMIN.FEES.PLATFORM_POLICIES, payload);
    },
    getBankTransferPolicies: async (params) => {
      return apiClient.get(ENDPOINTS.ADMIN.FEES.BANK_TRANSFER_POLICIES, { params });
    },
    createBankTransferPolicy: async (payload) => {
      return apiClient.post(ENDPOINTS.ADMIN.FEES.BANK_TRANSFER_POLICIES, payload);
    },
  },

  // Reconciliation
  reconciliation: {
    getRecords: async (params = { pageNumber: 1, pageSize: 20 }) => {
      return apiClient.get(ENDPOINTS.ADMIN.RECONCILIATION.RECORDS, { params });
    },
    getRecordById: async (id) => {
      return apiClient.get(ENDPOINTS.ADMIN.RECONCILIATION.RECORD_BY_ID(id));
    },
    requeryRecord: async (id, payload) => {
      return apiClient.post(ENDPOINTS.ADMIN.RECONCILIATION.REQUERY(id), payload);
    },
    getUnified: async (params) => {
      return apiClient.get(ENDPOINTS.ADMIN.RECONCILIATION.UNIFIED, { params });
    },
    getUnifiedById: async (id) => {
      return apiClient.get(ENDPOINTS.ADMIN.RECONCILIATION.UNIFIED_BY_ID(id));
    },
  },

  // Referrals
  referrals: {
    getSettings: async () => {
      return apiClient.get(ENDPOINTS.ADMIN.REFERRALS.SETTINGS);
    },
    updateSettings: async (payload) => {
      return apiClient.put(ENDPOINTS.ADMIN.REFERRALS.UPDATE_SETTINGS, payload);
    },
  },

  // Reviews & Recoveries
  reviews: {
    getPending: async (params) => {
      return apiClient.get(ENDPOINTS.ADMIN.REVIEWS.PENDING, { params });
    },
    submitDecision: async (payload) => {
      return apiClient.post(ENDPOINTS.ADMIN.REVIEWS.DECISION, payload);
    },
    getRecoveries: async (params) => {
      return apiClient.get(ENDPOINTS.ADMIN.REVIEWS.RECOVERIES, { params });
    },
    settleRecovery: async (id, payload) => {
      return apiClient.post(ENDPOINTS.ADMIN.REVIEWS.SETTLE_RECOVERY(id), payload);
    },
  },

  // Savings Policies
  savingsPolicies: {
    getPolicies: async () => {
      return apiClient.get(ENDPOINTS.ADMIN.SAVINGS_POLICIES.POLICIES);
    },
    createPolicy: async (payload) => {
      return apiClient.post(ENDPOINTS.ADMIN.SAVINGS_POLICIES.CREATE, payload);
    },
  },

  // Thrift
  thrift: {
    getGroups: async (params = { pageNumber: 1, pageSize: 20 }) => {
      return apiClient.get(ENDPOINTS.ADMIN.THRIFT.GROUPS, { params });
    },
    getGroupById: async (id) => {
      return apiClient.get(ENDPOINTS.ADMIN.THRIFT.GROUP_BY_ID(id));
    },
    getDelinquencies: async (params = { pageNumber: 1, pageSize: 20 }) => {
      return apiClient.get(ENDPOINTS.ADMIN.THRIFT.DELINQUENCIES, { params });
    },
    getDisputes: async (params = { pageNumber: 1, pageSize: 20 }) => {
      return apiClient.get(ENDPOINTS.ADMIN.THRIFT.DISPUTES, { params });
    },
    getDisputeById: async (id) => {
      return apiClient.get(ENDPOINTS.ADMIN.THRIFT.DISPUTE_BY_ID(id));
    },
    resolveDispute: async (id, payload) => {
      return apiClient.post(ENDPOINTS.ADMIN.THRIFT.RESOLVE_DISPUTE(id), payload);
    },
  },

  // Support
  support: {
    getReports: async (params) => {
      return apiClient.get(ENDPOINTS.ADMIN.SUPPORT.REPORTS, { params });
    },
    getTickets: async (params = { pageNumber: 1, pageSize: 20 }) => {
      return apiClient.get(ENDPOINTS.ADMIN.SUPPORT.TICKETS, { params });
    },
    getTicketById: async (id) => {
      return apiClient.get(ENDPOINTS.ADMIN.SUPPORT.TICKET_BY_ID(id));
    },
    addMessage: async (id, payload) => {
      return apiClient.post(ENDPOINTS.ADMIN.SUPPORT.ADD_MESSAGE(id), payload);
    },
    updateTicketStatus: async (id, payload) => {
      return apiClient.patch(ENDPOINTS.ADMIN.SUPPORT.UPDATE_STATUS(id), payload);
    },
  },
};
