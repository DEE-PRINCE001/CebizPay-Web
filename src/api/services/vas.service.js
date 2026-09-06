import apiClient from '../client.js';
import { ENDPOINTS } from '../endpoints.js';

export const vasService = {
  detectOperator: async (phoneNumber) => {
    return apiClient.get(ENDPOINTS.VAS.OPERATORS_DETECT, {
      params: { phoneNumber },
    });
  },

  getDataBundles: async (operator = null) => {
    return apiClient.get(ENDPOINTS.VAS.DATA_BUNDLES, {
      params: operator ? { operator } : {},
    });
  },

  purchaseAirtime: async (payload, idempotencyKey = null) => {
    return apiClient.post(ENDPOINTS.VAS.PURCHASE_AIRTIME, payload, {
      idempotent: true,
      headers: {
        'Content-Type': 'application/json',
        ...(idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {}),
      },
    });
  },

  purchaseData: async (payload, idempotencyKey = null) => {
    return apiClient.post(ENDPOINTS.VAS.PURCHASE_DATA, payload, {
      idempotent: true,
      headers: {
        'Content-Type': 'application/json',
        ...(idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {}),
      },
    });
  },

  getTransactionById: async (id) => {
    return apiClient.get(ENDPOINTS.VAS.TRANSACTION_BY_ID(id));
  },
};
