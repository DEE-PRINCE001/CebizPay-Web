import apiClient from '../client.js';
import { ENDPOINTS } from '../endpoints.js';

export const userService = {
  // Referrals
  getReferralDashboard: async () => {
    return apiClient.get(ENDPOINTS.REFERRALS.DASHBOARD);
  },

  getOrCreateReferralCode: async () => {
    return apiClient.post(ENDPOINTS.REFERRALS.GET_CODE);
  },

  claimReferralCode: async (referralCode) => {
    return apiClient.post(ENDPOINTS.REFERRALS.CLAIM_CODE, { referralCode });
  },

  // In-App Notifications
  getNotifications: async (params = { pageNumber: 1, pageSize: 20 }) => {
    return apiClient.get(ENDPOINTS.NOTIFICATIONS.LIST, { params });
  },

  getUnreadCount: async (organizationId = null) => {
    return apiClient.get(ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT, {
      params: organizationId ? { organizationId } : {},
    });
  },

  markNotificationRead: async (id) => {
    return apiClient.patch(ENDPOINTS.NOTIFICATIONS.MARK_READ(id));
  },

  markAllNotificationsRead: async (organizationId = null) => {
    return apiClient.post(ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ, null, {
      params: organizationId ? { organizationId } : {},
    });
  },

  getNotificationPreferences: async () => {
    return apiClient.get(ENDPOINTS.NOTIFICATIONS.PREFERENCES);
  },

  updateNotificationPreferences: async (payload) => {
    return apiClient.put(ENDPOINTS.NOTIFICATIONS.PREFERENCES, payload);
  },

  registerDeviceToken: async (payload) => {
    return apiClient.post(ENDPOINTS.NOTIFICATIONS.REGISTER_DEVICE, payload);
  },

  // Announcements
  getActiveAnnouncements: async (organizationId = null) => {
    return apiClient.get(ENDPOINTS.ANNOUNCEMENTS.ACTIVE, {
      params: organizationId ? { organizationId } : {},
    });
  },

  getAnnouncements: async (params = { pageNumber: 1, pageSize: 20 }) => {
    return apiClient.get(ENDPOINTS.ANNOUNCEMENTS.LIST, { params });
  },

  getAnnouncementById: async (id) => {
    return apiClient.get(ENDPOINTS.ANNOUNCEMENTS.GET_BY_ID(id));
  },

  createAnnouncement: async (payload) => {
    return apiClient.post(ENDPOINTS.ANNOUNCEMENTS.CREATE, payload);
  },

  updateAnnouncement: async (id, payload) => {
    return apiClient.put(ENDPOINTS.ANNOUNCEMENTS.UPDATE(id), payload);
  },

  deleteAnnouncement: async (id) => {
    return apiClient.delete(ENDPOINTS.ANNOUNCEMENTS.DELETE(id));
  },
};
