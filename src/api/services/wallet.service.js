import apiClient from '../client.js';
import { ENDPOINTS } from '../endpoints.js';

export const walletService = {
  /**
   * Retrieves wallet balance and overview for individual or organization context.
   */
  getWallet: async (organizationId = null) => {
    return apiClient.get(ENDPOINTS.WALLET.DETAILS, {
      params: organizationId ? { organizationId } : {},
    });
  },

  /**
   * Retrieves transaction history.
   */
  getTransactions: async (params = { pageNumber: 1, pageSize: 20 }) => {
    return apiClient.get(ENDPOINTS.WALLET.TRANSACTIONS, { params });
  },

  /**
   * Performs an instant internal peer-to-peer transfer.
   * Auto-sets idempotency key.
   */
  peerTransfer: async (payload, idempotencyKey = null) => {
    return apiClient.post(ENDPOINTS.WALLET.PEER_TRANSFER, payload, {
      idempotent: true,
      headers: idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {},
    });
  },

  /**
   * Performs an outbound bank transfer via standard payout channels.
   * Auto-sets idempotency key.
   */
  bankTransfer: async (payload, idempotencyKey = null) => {
    return apiClient.post(ENDPOINTS.WALLET.BANK_TRANSFER, payload, {
      idempotent: true,
      headers: idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {},
    });
  },

  // Virtual Accounts
  provisionVirtualAccount: async (payload) => {
    return apiClient.post(ENDPOINTS.WALLET.VIRTUAL_ACCOUNTS.PROVISION, payload);
  },

  getVirtualAccounts: async (organizationId = null) => {
    return apiClient.get(ENDPOINTS.WALLET.VIRTUAL_ACCOUNTS.LIST, {
      params: organizationId ? { organizationId } : {},
    });
  },
};
