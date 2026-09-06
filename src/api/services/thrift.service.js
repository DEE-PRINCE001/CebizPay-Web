import apiClient from '../client.js';
import { ENDPOINTS } from '../endpoints.js';

export const thriftService = {
  // Individual Thrift / Esusu Groups
  getGroups: async (params) => {
    return apiClient.get(ENDPOINTS.THRIFT.GROUPS, { params });
  },

  getGroupById: async (id) => {
    return apiClient.get(ENDPOINTS.THRIFT.GET_GROUP(id));
  },

  createGroup: async (payload) => {
    return apiClient.post(ENDPOINTS.THRIFT.CREATE_GROUP, payload);
  },

  pauseGroup: async (id, payload) => {
    return apiClient.post(ENDPOINTS.THRIFT.PAUSE_GROUP(id), payload);
  },

  inviteMember: async (groupId, payload) => {
    return apiClient.post(ENDPOINTS.THRIFT.INVITE_MEMBER(groupId), payload);
  },

  acceptInvitation: async (groupId, payload) => {
    return apiClient.post(ENDPOINTS.THRIFT.ACCEPT_INVITATION(groupId), payload);
  },

  selectPosition: async (groupId, payload) => {
    return apiClient.post(ENDPOINTS.THRIFT.SELECT_POSITION(groupId), payload);
  },

  removeMember: async (groupId, memberId, payload) => {
    return apiClient.delete(ENDPOINTS.THRIFT.REMOVE_MEMBER(groupId, memberId), { data: payload });
  },

  // Disputes
  createDispute: async (groupId, payload) => {
    return apiClient.post(ENDPOINTS.THRIFT.DISPUTES.CREATE(groupId), payload);
  },

  getDisputes: async (groupId, params) => {
    return apiClient.get(ENDPOINTS.THRIFT.DISPUTES.LIST(groupId), { params });
  },

  resolveDispute: async (groupId, disputeId, payload) => {
    return apiClient.post(ENDPOINTS.THRIFT.DISPUTES.RESOLVE(groupId, disputeId), payload);
  },

  // Staff Thrift
  getStaffGroups: async (organizationId = null) => {
    return apiClient.get(ENDPOINTS.THRIFT.STAFF_THRIFT.GROUPS, {
      params: organizationId ? { organizationId } : {},
    });
  },

  joinStaffGroup: async (id, payload) => {
    return apiClient.post(ENDPOINTS.THRIFT.STAFF_THRIFT.JOIN(id), payload);
  },

  acceptStaffInvite: async (id, payload) => {
    return apiClient.post(ENDPOINTS.THRIFT.STAFF_THRIFT.ACCEPT_INVITE(id), payload);
  },

  // Organization Thrift
  getOrgGroups: async (organizationId = null) => {
    return apiClient.get(ENDPOINTS.THRIFT.ORG_THRIFT.GROUPS, {
      params: organizationId ? { organizationId } : {},
    });
  },

  createOrgGroup: async (payload) => {
    return apiClient.post(ENDPOINTS.THRIFT.ORG_THRIFT.CREATE, payload);
  },
};
