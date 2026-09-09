import apiClient from '../client.js';
import { ENDPOINTS } from '../endpoints.js';

export const userService = {
  // Referrals
  getReferralDashboard: async () => {
    return apiClient.get(ENDPOINTS.USER.REFERRALS.DASHBOARD);
  },

  getOrCreateReferralCode: async () => {
    return apiClient.post(ENDPOINTS.USER.REFERRALS.GET_CODE);
  },

  claimReferralCode: async (referralCode) => {
    return apiClient.post(ENDPOINTS.USER.REFERRALS.CLAIM_CODE, { referralCode });
  },

  // In-App Notifications
  getNotifications: async (params = { pageNumber: 1, pageSize: 20 }) => {
    return apiClient.get(ENDPOINTS.USER.NOTIFICATIONS.LIST, { params });
  },

  getUnreadCount: async (organizationId = null) => {
    return apiClient.get(ENDPOINTS.USER.NOTIFICATIONS.UNREAD_COUNT, {
      params: organizationId ? { organizationId } : {},
    });
  },

  markNotificationRead: async (id) => {
    return apiClient.patch(ENDPOINTS.USER.NOTIFICATIONS.MARK_READ(id));
  },

  markAllNotificationsRead: async (organizationId = null) => {
    return apiClient.post(ENDPOINTS.USER.NOTIFICATIONS.MARK_ALL_READ, null, {
      params: organizationId ? { organizationId } : {},
    });
  },

  getNotificationPreferences: async () => {
    return apiClient.get(ENDPOINTS.USER.NOTIFICATIONS.PREFERENCES);
  },

  updateNotificationPreferences: async (payload) => {
    return apiClient.put(ENDPOINTS.USER.NOTIFICATIONS.PREFERENCES, payload);
  },

  registerDeviceToken: async (payload) => {
    return apiClient.post(ENDPOINTS.USER.NOTIFICATIONS.REGISTER_DEVICE, payload);
  },

  // Announcements
  getPlatformAnnouncements: async (params = { pageNumber: 1, pageSize: 20 }) => {
    return apiClient.get(ENDPOINTS.USER.ANNOUNCEMENTS.PLATFORM, { params });
  },

  getActiveAnnouncements: async (organizationId = null) => {
    return apiClient.get(ENDPOINTS.USER.ANNOUNCEMENTS.ACTIVE, {
      params: organizationId ? { organizationId } : {},
    });
  },

  getAnnouncements: async (params = { pageNumber: 1, pageSize: 20 }) => {
    return apiClient.get(ENDPOINTS.USER.ANNOUNCEMENTS.LIST, { params });
  },

  getAnnouncementById: async (id) => {
    return apiClient.get(ENDPOINTS.USER.ANNOUNCEMENTS.GET_BY_ID(id));
  },

  createAnnouncement: async (payload) => {
    return apiClient.post(ENDPOINTS.USER.ANNOUNCEMENTS.CREATE, payload);
  },

  updateAnnouncement: async (id, payload) => {
    return apiClient.put(ENDPOINTS.USER.ANNOUNCEMENTS.UPDATE(id), payload);
  },

  deleteAnnouncement: async (id) => {
    return apiClient.delete(ENDPOINTS.USER.ANNOUNCEMENTS.DELETE(id));
  },
};
