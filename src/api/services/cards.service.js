import apiClient from '../client.js';
import { ENDPOINTS } from '../endpoints.js';

export const cardsService = {
  getSavedCards: async () => {
    return apiClient.get(ENDPOINTS.CARDS.SAVED_CARDS);
  },

  getSavedCardById: async (id) => {
    return apiClient.get(ENDPOINTS.CARDS.GET_BY_ID(id));
  },

  deleteSavedCard: async (id) => {
    return apiClient.delete(ENDPOINTS.CARDS.DELETE_CARD(id));
  },

  setDefaultCard: async (id) => {
    return apiClient.patch(ENDPOINTS.CARDS.SET_DEFAULT(id));
  },

  chargeSavedCard: async (payload, idempotencyKey = null) => {
    return apiClient.post(ENDPOINTS.CARDS.CHARGE_SAVED_CARD, payload, {
      idempotent: true,
      headers: idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {},
    });
  },

  // Card Funding
  initializeFunding: async (payload, idempotencyKey = null) => {
    return apiClient.post(ENDPOINTS.CARDS.FUNDING.INITIALIZE, payload, {
      idempotent: true,
      headers: idempotencyKey ? { 'X-Idempotency-Key': idempotencyKey } : {},
    });
  },

  verifyFunding: async (payload) => {
    return apiClient.post(ENDPOINTS.CARDS.FUNDING.VERIFY, payload);
  },

  getFundingStatus: async (reference) => {
    return apiClient.get(ENDPOINTS.CARDS.FUNDING.STATUS(reference));
  },

  // Card Verification
  initializeVerification: async (payload) => {
    return apiClient.post(ENDPOINTS.CARDS.VERIFICATION.INITIALIZE, payload);
  },

  completeVerification: async (payload) => {
    return apiClient.post(ENDPOINTS.CARDS.VERIFICATION.COMPLETE, payload);
  },

  // Card Refunds
  requestRefund: async (payload, idempotencyKey = null) => {
    return apiClient.post(ENDPOINTS.CARDS.REFUNDS.REQUEST, payload, {
      idempotent: true,
      headers: idempotencyKey ? { 'X-Idempotency-Key': idempotencyKey } : {},
    });
  },

  getRefunds: async (params = { pageNumber: 1, pageSize: 20 }) => {
    return apiClient.get(ENDPOINTS.CARDS.REFUNDS.LIST, { params });
  },

  getRefundById: async (id) => {
    return apiClient.get(ENDPOINTS.CARDS.REFUNDS.GET_BY_ID(id));
  },
};
