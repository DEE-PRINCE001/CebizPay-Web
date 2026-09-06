import apiClient from '../client.js';
import { ENDPOINTS } from '../endpoints.js';

export const vasService = {
  getNetworks: async () => {
    return apiClient.get(ENDPOINTS.VAS.NETWORKS);
  },

  detectOperator: async (phoneNumber) => {
    return apiClient.get(ENDPOINTS.VAS.DETECT_OPERATOR, {
      params: { phoneNumber },
    });
  },

  getDataBundles: async (network) => {
    return apiClient.get(ENDPOINTS.VAS.DATA_BUNDLES(network));
  },

  purchaseAirtime: async (payload, idempotencyKey = null) => {
    return apiClient.post(ENDPOINTS.VAS.PURCHASE_AIRTIME, payload, {
      idempotent: true,
      headers: idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {},
    });
  },

  purchaseData: async (payload, idempotencyKey = null) => {
    return apiClient.post(ENDPOINTS.VAS.PURCHASE_DATA, payload, {
      idempotent: true,
      headers: idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {},
    });
  },
};
