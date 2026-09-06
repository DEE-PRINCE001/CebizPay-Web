import apiClient from '../client.js';
import { ENDPOINTS } from '../endpoints.js';

export const userService = {
  // Referrals
  getReferralDashboard: async () => {
    return apiClient.get(ENDPOINTS.USER.REFERRALS.DASHBOARD);
  },

  getOrCreateReferralCode: async () => {
    return apiClient.post(ENDPOINTS.USER.REFERRALS.GET_OR_CREATE_CODE);
  },

  claimReferralCode: async (code) => {
    return apiClient.post(ENDPOINTS.USER.REFERRALS.CLAIM_CODE, { referralCode: code });
  },

  // In-App Notifications
  getNotifications: async (params = { pageNumber: 1, pageSize: 20 }) => {
    return apiClient.get(ENDPOINTS.USER.NOTIFICATIONS.LIST, { params });
  },

  getUnreadCount: async () => {
    return apiClient.get(ENDPOINTS.USER.NOTIFICATIONS.UNREAD_COUNT);
  },

  markNotificationRead: async (id) => {
    return apiClient.patch(ENDPOINTS.USER.NOTIFICATIONS.MARK_READ(id));
  },

  markAllNotificationsRead: async () => {
    return apiClient.post(ENDPOINTS.USER.NOTIFICATIONS.MARK_ALL_READ);
  },

  getNotificationPreferences: async () => {
    return apiClient.get(ENDPOINTS.USER.NOTIFICATIONS.PREFERENCES);
  },

  updateNotificationPreferences: async (preferences) => {
    return apiClient.put(ENDPOINTS.USER.NOTIFICATIONS.PREFERENCES, preferences);
  },

  registerDeviceToken: async (payload) => {
    return apiClient.post(ENDPOINTS.USER.NOTIFICATIONS.REGISTER_DEVICE, payload);
  },

  // Announcements
  getActiveAnnouncements: async () => {
    return apiClient.get(ENDPOINTS.USER.ANNOUNCEMENTS.ACTIVE);
  },

  getAnnouncements: async (params = { pageNumber: 1, pageSize: 20 }) => {
    return apiClient.get(ENDPOINTS.USER.ANNOUNCEMENTS.LIST, { params });
  },

  getAnnouncementById: async (id) => {
    return apiClient.get(ENDPOINTS.USER.ANNOUNCEMENTS.GET_BY_ID(id));
  },
};
