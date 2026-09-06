import axios from 'axios';
import { normalizeApiError } from './errorHandler.js';

export const TOKEN_STORAGE_KEY = 'cebizpay_access_token';
export const REFRESH_TOKEN_STORAGE_KEY = 'cebizpay_refresh_token';
export const ACTIVE_ORG_STORAGE_KEY = 'cebizpay_active_org_id';

// Custom DOM events for auth state synchronization across tabs & context
export const AUTH_EVENTS = {
  UNAUTHORIZED: 'cebizpay:unauthorized',
  TOKENS_REFRESHED: 'cebizpay:tokens_refreshed',
};

export const getStoredAccessToken = () => localStorage.getItem(TOKEN_STORAGE_KEY);
export const getStoredRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
export const getStoredActiveOrgId = () => localStorage.getItem(ACTIVE_ORG_STORAGE_KEY);

export const setStoredTokens = (accessToken, refreshToken) => {
  if (accessToken) localStorage.setItem(TOKEN_STORAGE_KEY, accessToken);
  if (refreshToken) localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, refreshToken);
  window.dispatchEvent(
    new CustomEvent(AUTH_EVENTS.TOKENS_REFRESHED, {
      detail: { accessToken, refreshToken },
    })
  );
};

export const setStoredActiveOrgId = (orgId) => {
  if (orgId) {
    localStorage.setItem(ACTIVE_ORG_STORAGE_KEY, orgId);
  } else {
    localStorage.removeItem(ACTIVE_ORG_STORAGE_KEY);
  }
};

export const clearStoredAuth = () => {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
  localStorage.removeItem(ACTIVE_ORG_STORAGE_KEY);
  window.dispatchEvent(new CustomEvent(AUTH_EVENTS.UNAUTHORIZED));
};

// Base Axios instance
const baseURL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) || 'http://127.0.0.1:5015';

const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Refresh token concurrency lock and subscriber queue
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request Interceptor: Attach JWT token, Organization ID, and Idempotency Key
apiClient.interceptors.request.use(
  (config) => {
    const accessToken = getStoredAccessToken();
    if (accessToken && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    const activeOrgId = getStoredActiveOrgId();
    if (activeOrgId && !config.headers['X-Organization-Id']) {
      config.headers['X-Organization-Id'] = activeOrgId;
    }

    // Auto-generate Idempotency-Key for financial / mutation requests when requested or needed
    if (config.idempotent || config.headers['Idempotency-Key'] || config.headers['X-Idempotency-Key']) {
      const key = config.headers['Idempotency-Key'] || config.headers['X-Idempotency-Key'] || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `idemp-${Date.now()}-${Math.random().toString(36).substring(2)}`);
      config.headers['Idempotency-Key'] = key;
      config.headers['X-Idempotency-Key'] = key;
    }

    return config;
  },
  (error) => Promise.reject(normalizeApiError(error))
);

// Response Interceptor: Silent Token Refresh & ProblemDetails normalization
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized (Expired Access Token)
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Don't attempt refresh if the failing endpoint was the refresh endpoint or login endpoint itself
      const isAuthUrl =
        originalRequest.url?.includes('/auth/refresh-token') ||
        originalRequest.url?.includes('/auth/login') ||
        originalRequest.url?.includes('/auth/revoke-token');

      if (isAuthUrl) {
        clearStoredAuth();
        return Promise.reject(normalizeApiError(error));
      }

      if (isRefreshing) {
        // Enqueue request while another refresh is already in flight
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const currentRefreshToken = getStoredRefreshToken();

      if (!currentRefreshToken) {
        isRefreshing = false;
        clearStoredAuth();
        return Promise.reject(normalizeApiError(error));
      }

      try {
        // Execute token refresh
        const refreshResponse = await axios.post(
          `${apiClient.defaults.baseURL}/api/v1/auth/refresh-token`,
          {
            refreshToken: currentRefreshToken,
            ipAddress: null,
          },
          {
            headers: { 'Content-Type': 'application/json' },
          }
        );

        const newAccessToken = refreshResponse.data?.accessToken || refreshResponse.data?.token;
        const newRefreshToken = refreshResponse.data?.refreshToken || currentRefreshToken;

        if (newAccessToken) {
          setStoredTokens(newAccessToken, newRefreshToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          processQueue(null, newAccessToken);
          return apiClient(originalRequest);
        } else {
          throw new Error('Refresh response did not contain new access token.');
        }
      } catch (refreshErr) {
        processQueue(normalizeApiError(refreshErr), null);
        clearStoredAuth();
        return Promise.reject(normalizeApiError(refreshErr));
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(normalizeApiError(error));
  }
);

export default apiClient;
