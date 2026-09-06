import apiClient, { setStoredTokens, clearStoredAuth, getStoredRefreshToken } from '../client.js';
import { ENDPOINTS } from '../endpoints.js';

export const authService = {
  /**
   * Authenticates a user with email and password.
   * @param {{ email: string, password: string }} credentials
   */
  login: async (credentials) => {
    const data = await apiClient.post(ENDPOINTS.AUTH.LOGIN, credentials);
    if (data?.accessToken) {
      setStoredTokens(data.accessToken, data.refreshToken);
    }
    return data;
  },

  /**
   * Retrieves full profile, identity, admin, and workplace details of the currently authenticated user.
   */
  getMe: async () => {
    return apiClient.get(ENDPOINTS.AUTH.ME);
  },

  /**
   * Verifies short-lived MFA challenge code to obtain JWT tokens.
   * @param {{ challengeId: string, code: string }} payload
   */
  verifyMfa: async (payload) => {
    const data = await apiClient.post(ENDPOINTS.AUTH.MFA_VERIFY, payload);
    if (data?.accessToken) {
      setStoredTokens(data.accessToken, data.refreshToken);
    }
    return data;
  },

  /**
   * Enables or disables MFA for the authenticated user/admin profile.
   * @param {{ userId: string, enable: boolean }} payload
   */
  toggleMfa: async (payload) => {
    return apiClient.post(ENDPOINTS.AUTH.MFA_TOGGLE, payload);
  },

  /**
   * Initiates phone registration via OTP.
   * @param {{ phone: string, deviceId: string }} payload
   */
  registerPhone: async (payload) => {
    return apiClient.post(ENDPOINTS.AUTH.REGISTER_PHONE, payload);
  },

  /**
   * Verifies mobile OTP and completes registration.
   * @param {{ phone: string, code: string, email: string, password: string, firstName: string, lastName: string }} payload
   */
  verifyOtp: async (payload) => {
    const data = await apiClient.post(ENDPOINTS.AUTH.REGISTER_OTP_VERIFY, payload);
    if (data?.accessToken) {
      setStoredTokens(data.accessToken, data.refreshToken);
    }
    return data;
  },

  /**
   * Changes password for the authenticated user.
   * @param {{ userId: string, currentPassword: string, newPassword: string, isMobile?: boolean }} payload
   */
  changePassword: async (payload) => {
    return apiClient.post(ENDPOINTS.AUTH.CHANGE_PASSWORD, {
      isMobile: false,
      ...payload,
    });
  },

  /**
   * Redeems an administrative invitation token and initializes admin credentials.
   * @param {{ invitationToken: string, password: string, phoneNumber?: string }} payload
   */
  redeemAdminInvite: async (payload) => {
    const data = await apiClient.post(ENDPOINTS.AUTH.ADMIN_REDEEM_INVITE, payload);
    if (data?.accessToken) {
      setStoredTokens(data.accessToken, data.refreshToken);
    }
    return data;
  },

  /**
   * Exchanges an active refresh token for a new JWT access token and rotated refresh token.
   * @param {string} [refreshTokenOverride]
   */
  refreshToken: async (refreshTokenOverride = null) => {
    const refreshToken = refreshTokenOverride || getStoredRefreshToken();
    if (!refreshToken) throw new Error('No refresh token available');

    const data = await apiClient.post(ENDPOINTS.AUTH.REFRESH_TOKEN, {
      refreshToken,
      ipAddress: null,
    });

    if (data?.accessToken) {
      setStoredTokens(data.accessToken, data.refreshToken || refreshToken);
    }
    return data;
  },

  /**
   * Explicitly revokes a refresh token (e.g. on user logout).
   */
  logout: async () => {
    const refreshToken = getStoredRefreshToken();
    try {
      if (refreshToken) {
        await apiClient.post(ENDPOINTS.AUTH.REVOKE_TOKEN, { refreshToken });
      }
    } catch {
      // Continue client cleanup even if network fails
    } finally {
      clearStoredAuth();
    }
  },
};
