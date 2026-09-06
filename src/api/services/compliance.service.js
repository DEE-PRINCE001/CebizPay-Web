import apiClient from '../client.js';
import { ENDPOINTS } from '../endpoints.js';

export const complianceService = {
  // Individual KYC
  submitKycDocument: async (individualId, formData) => {
    return apiClient.post(ENDPOINTS.COMPLIANCE.INDIVIDUAL_KYC.SUBMIT(individualId), formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  getKycDocuments: async (individualId) => {
    return apiClient.get(ENDPOINTS.COMPLIANCE.INDIVIDUAL_KYC.LIST(individualId));
  },

  updateKycStatus: async (individualId, payload) => {
    return apiClient.patch(ENDPOINTS.COMPLIANCE.INDIVIDUAL_KYC.UPDATE_STATUS(individualId), payload);
  },

  // Organization KYB
  registerKybStep1: async (payload) => {
    return apiClient.post(ENDPOINTS.COMPLIANCE.KYB.REGISTER_STEP1, payload);
  },

  registerKybStep2: async (payload) => {
    return apiClient.post(ENDPOINTS.COMPLIANCE.KYB.REGISTER_STEP2, payload);
  },

  updateOrgStatus: async (orgId, payload) => {
    return apiClient.patch(ENDPOINTS.COMPLIANCE.KYB.UPDATE_STATUS(orgId), payload);
  },

  // Direct Identity & Background Verification
  verifyBvn: async (payload) => {
    return apiClient.post(ENDPOINTS.COMPLIANCE.IDENTITY_VERIFICATION.VERIFY_BVN, payload);
  },

  verifyNin: async (payload) => {
    return apiClient.post(ENDPOINTS.COMPLIANCE.IDENTITY_VERIFICATION.VERIFY_NIN, payload);
  },

  verifyBusiness: async (payload) => {
    return apiClient.post(ENDPOINTS.COMPLIANCE.IDENTITY_VERIFICATION.VERIFY_BUSINESS, payload);
  },

  verifyDocument: async (formData) => {
    return apiClient.post(ENDPOINTS.COMPLIANCE.IDENTITY_VERIFICATION.VERIFY_DOCUMENT, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  verifyBiometrics: async (payload) => {
    return apiClient.post(ENDPOINTS.COMPLIANCE.IDENTITY_VERIFICATION.VERIFY_BIOMETRICS, payload);
  },

  screenAml: async (payload) => {
    return apiClient.post(ENDPOINTS.COMPLIANCE.IDENTITY_VERIFICATION.SCREEN_AML, payload);
  },

  checkEligibility: async (payload) => {
    return apiClient.post(ENDPOINTS.COMPLIANCE.IDENTITY_VERIFICATION.ELIGIBILITY, payload);
  },

  getCddProfile: async (params) => {
    return apiClient.get(ENDPOINTS.COMPLIANCE.IDENTITY_VERIFICATION.CDD_PROFILE, { params });
  },

  submitEddInformation: async (caseId, payload) => {
    return apiClient.post(ENDPOINTS.COMPLIANCE.IDENTITY_VERIFICATION.SUBMIT_EDD_INFO(caseId), payload);
  },

  getBeneficialOwners: async (payload) => {
    return apiClient.post(ENDPOINTS.COMPLIANCE.IDENTITY_VERIFICATION.BENEFICIAL_OWNERS, payload);
  },
};
