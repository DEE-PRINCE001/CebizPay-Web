import apiClient from '../client.js';
import { ENDPOINTS } from '../endpoints.js';

export const walletService = {
  getWallet: async (organizationId = null) => {
    return apiClient.get(ENDPOINTS.WALLET.GET_DETAILS, {
      params: organizationId ? { organizationId } : {},
    });
  },

  getTransactions: async (params = { pageNumber: 1, pageSize: 20 }) => {
    return apiClient.get(ENDPOINTS.WALLET.GET_TRANSACTIONS, { params });
  },

  peerTransfer: async (payload, idempotencyKey = null) => {
    return apiClient.post(ENDPOINTS.WALLET.PEER_TRANSFER, payload, {
      idempotent: true,
      headers: idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {},
    });
  },

  bankTransfer: async (payload, idempotencyKey = null) => {
    return apiClient.post(ENDPOINTS.WALLET.BANK_TRANSFER, payload, {
      idempotent: true,
      headers: idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {},
    });
  },

  resolveAccount: async (params) => {
    return apiClient.get(ENDPOINTS.WALLET.RESOLVE_ACCOUNT, { params });
  },

  getExternalAccounts: async (organizationId = null) => {
    return apiClient.get(ENDPOINTS.WALLET.EXTERNAL_ACCOUNTS, {
      params: organizationId ? { organizationId } : {},
    });
  },

  getExternalAccountById: async (id) => {
    return apiClient.get(ENDPOINTS.WALLET.EXTERNAL_ACCOUNT_BY_ID(id));
  },

  deleteExternalAccount: async (id) => {
    return apiClient.delete(ENDPOINTS.WALLET.EXTERNAL_ACCOUNT_BY_ID(id));
  },

  provisionMonnifyAccount: async (organizationId = null) => {
    return apiClient.post(ENDPOINTS.WALLET.PROVISION_MONNIFY, null, {
      params: organizationId ? { organizationId } : {},
    });
  },

  setPrimaryExternalAccount: async (id, organizationId = null) => {
    return apiClient.post(ENDPOINTS.WALLET.SET_PRIMARY_EXTERNAL(id), null, {
      params: organizationId ? { organizationId } : {},
    });
  },

  getFundingStatus: async (id) => {
    return apiClient.get(ENDPOINTS.WALLET.FUNDING_STATUS(id));
  },

  // Virtual Accounts
  provisionVirtualAccount: async (payload) => {
    return apiClient.post(ENDPOINTS.VIRTUAL_ACCOUNTS.PROVISION, payload);
  },

  getPrimaryVirtualAccount: async (organizationId = null) => {
    return apiClient.get(ENDPOINTS.VIRTUAL_ACCOUNTS.PRIMARY, {
      params: organizationId ? { organizationId } : {},
    });
  },
};
