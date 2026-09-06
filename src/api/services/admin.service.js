import apiClient from '../client.js';
import { ENDPOINTS } from '../endpoints.js';

export const adminService = {
  // Audit Logs
  getAuditLogs: async (params = { pageNumber: 1, pageSize: 20 }) => {
    return apiClient.get(ENDPOINTS.ADMIN.AUDIT_LOGS, { params });
  },

  // Compliance & EDD
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

  // Fee Policies
  fees: {
    getPolicies: async (params) => {
      return apiClient.get(ENDPOINTS.ADMIN.FEES.POLICIES, { params });
    },
    createPlatformPolicy: async (payload) => {
      return apiClient.post(ENDPOINTS.ADMIN.FEES.PLATFORM_POLICIES, payload);
    },
    createBankTransferPolicy: async (payload) => {
      return apiClient.post(ENDPOINTS.ADMIN.FEES.BANK_TRANSFER_POLICIES, payload);
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
    toggleStatus: async (id, payload) => {
      return apiClient.patch(ENDPOINTS.ADMIN.MANAGE.TOGGLE_STATUS(id), payload);
    },
    grantPermission: async (id, payload) => {
      return apiClient.post(ENDPOINTS.ADMIN.MANAGE.GRANT_PERMISSION(id), payload);
    },
    revokePermission: async (id, payload) => {
      return apiClient.post(ENDPOINTS.ADMIN.MANAGE.REVOKE_PERMISSION(id), payload);
    },
  },

  // Financial Reconciliation
  reconciliation: {
    getRecords: async (params = { pageNumber: 1, pageSize: 20 }) => {
      return apiClient.get(ENDPOINTS.ADMIN.RECONCILIATION.RECORDS, { params });
    },
    getUnified: async (params) => {
      return apiClient.get(ENDPOINTS.ADMIN.RECONCILIATION.UNIFIED, { params });
    },
  },

  // Referral Settings
  referrals: {
    getSettings: async () => {
      return apiClient.get(ENDPOINTS.ADMIN.REFERRALS.SETTINGS);
    },
    updateSettings: async (payload) => {
      return apiClient.put(ENDPOINTS.ADMIN.REFERRALS.UPDATE_SETTINGS, payload);
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

  // Admin Thrift Management & Delinquencies
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
    resolveDispute: async (id, payload) => {
      return apiClient.post(ENDPOINTS.ADMIN.THRIFT.RESOLVE_DISPUTE(id), payload);
    },
  },

  // Admin Support & Reports
  support: {
    getReports: async (params) => {
      return apiClient.get(ENDPOINTS.ADMIN.SUPPORT.REPORTS, { params });
    },
    getTickets: async (params = { pageNumber: 1, pageSize: 20 }) => {
      return apiClient.get(ENDPOINTS.ADMIN.SUPPORT.TICKETS, { params });
    },
  },

  // Announcements
  announcements: {
    create: async (payload) => {
      return apiClient.post(ENDPOINTS.ADMIN.ANNOUNCEMENTS.CREATE, payload);
    },
    update: async (id, payload) => {
      return apiClient.put(ENDPOINTS.ADMIN.ANNOUNCEMENTS.UPDATE(id), payload);
    },
    delete: async (id) => {
      return apiClient.delete(ENDPOINTS.ADMIN.ANNOUNCEMENTS.DELETE(id));
    },
  },
};
