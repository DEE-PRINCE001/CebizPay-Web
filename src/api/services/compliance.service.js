import apiClient from '../client.js';
import { ENDPOINTS } from '../endpoints.js';

export const complianceService = {
  // Individual KYC
  submitKycDocuments: async (individualId, formData) => {
    return apiClient.post(ENDPOINTS.INDIVIDUAL_KYC.SUBMIT_DOCUMENTS(individualId), formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  getKycDocuments: async (individualId) => {
    return apiClient.get(ENDPOINTS.INDIVIDUAL_KYC.GET_DOCUMENTS(individualId));
  },

  updateKycStatus: async (individualId, payload) => {
    return apiClient.patch(ENDPOINTS.INDIVIDUAL_KYC.UPDATE_STATUS(individualId), payload);
  },

  // Organization KYB
  registerKybStep1: async (payload) => {
    return apiClient.post(ENDPOINTS.ORGANIZATION_KYB.REGISTER_STEP1, payload);
  },

  registerKybStep2: async (payload) => {
    return apiClient.post(ENDPOINTS.ORGANIZATION_KYB.REGISTER_STEP2, payload);
  },

  updateOrgStatus: async (orgId, payload) => {
    return apiClient.patch(ENDPOINTS.ORGANIZATION_KYB.UPDATE_STATUS(orgId), payload);
  },

  // Direct Identity & Background Verification
  verifyBvn: async (payload, idempotencyKey = null) => {
    return apiClient.post(ENDPOINTS.COMPLIANCE.VERIFY_BVN, payload, {
      idempotent: true,
      headers: idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {},
    });
  },

  verifyNin: async (payload, idempotencyKey = null) => {
    return apiClient.post(ENDPOINTS.COMPLIANCE.VERIFY_NIN, payload, {
      idempotent: true,
      headers: idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {},
    });
  },

  verifyBusiness: async (payload, idempotencyKey = null) => {
    return apiClient.post(ENDPOINTS.COMPLIANCE.VERIFY_BUSINESS, payload, {
      idempotent: true,
      headers: idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {},
    });
  },

  verifyDocument: async (formData, idempotencyKey = null) => {
    return apiClient.post(ENDPOINTS.COMPLIANCE.VERIFY_DOCUMENT, formData, {
      idempotent: true,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...(idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {}),
      },
    });
  },

  verifyBiometrics: async (payload, idempotencyKey = null) => {
    return apiClient.post(ENDPOINTS.COMPLIANCE.VERIFY_BIOMETRICS, payload, {
      idempotent: true,
      headers: idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {},
    });
  },

  screenAml: async (payload, idempotencyKey = null) => {
    return apiClient.post(ENDPOINTS.COMPLIANCE.SCREEN_AML, payload, {
      idempotent: true,
      headers: idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {},
    });
  },

  checkEligibility: async (payload) => {
    return apiClient.post(ENDPOINTS.COMPLIANCE.CHECK_ELIGIBILITY, payload);
  },

  getCddProfile: async (params) => {
    return apiClient.get(ENDPOINTS.COMPLIANCE.CDD_PROFILE, { params });
  },

  submitEddInformation: async (caseId, payload) => {
    return apiClient.post(ENDPOINTS.COMPLIANCE.SUBMIT_EDD_INFO(caseId), payload);
  },

  getBeneficialOwners: async (payload) => {
    return apiClient.post(ENDPOINTS.COMPLIANCE.BENEFICIAL_OWNERS, payload);
  },
};
