import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { AuthContext } from './authContextInstance.js';
import { authService } from '../api/services/auth.service.js';
import {
  getStoredAccessToken,
  getStoredRefreshToken,
  getStoredActiveOrgId,
  setStoredActiveOrgId,
  clearStoredAuth,
  AUTH_EVENTS,
} from '../api/client.js';
import { queryClient } from '../lib/queryClient.js';

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(() => getStoredAccessToken());
  const [refreshToken, setRefreshToken] = useState(() => getStoredRefreshToken());
  const [activeOrgId, setActiveOrgId] = useState(() => getStoredActiveOrgId());
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mfaChallenge, setMfaChallenge] = useState(null);

  // Fetch full user profile from /auth/me
  const fetchUserProfile = useCallback(async () => {
    try {
      const profile = await authService.getMe();
      setUser(profile);

      // Determine active organization ID
      const storedOrgId = getStoredActiveOrgId();
      const validStoredOrg = profile.organizations?.some((o) => o.organizationId === storedOrgId);

      if (storedOrgId && validStoredOrg) {
        setActiveOrgId(storedOrgId);
      } else if (profile.activeOrganizationId) {
        setActiveOrgId(profile.activeOrganizationId);
        setStoredActiveOrgId(profile.activeOrganizationId);
      } else if (profile.organizations?.length > 0) {
        const firstOrgId = profile.organizations[0].organizationId;
        setActiveOrgId(firstOrgId);
        setStoredActiveOrgId(firstOrgId);
      } else {
        setActiveOrgId(null);
        setStoredActiveOrgId(null);
      }

      return profile;
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
      if (err.status === 401 || err.status === 403) {
        clearStoredAuth();
        setUser(null);
        setAccessToken(null);
        setRefreshToken(null);
        setActiveOrgId(null);
      }
      return null;
    }
  }, []);

  // Initialize and validate auth on app launch
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = getStoredAccessToken();
      const storedRefresh = getStoredRefreshToken();

      if (storedToken) {
        setAccessToken(storedToken);
        setRefreshToken(storedRefresh);
        await fetchUserProfile();
      } else if (storedRefresh) {
        try {
          const data = await authService.refreshToken(storedRefresh);
          if (data?.accessToken) {
            setAccessToken(data.accessToken);
            setRefreshToken(data.refreshToken || storedRefresh);
            await fetchUserProfile();
          }
        } catch {
          clearStoredAuth();
          setUser(null);
          setAccessToken(null);
          setRefreshToken(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, [fetchUserProfile]);

  // Listen for global client auth events
  useEffect(() => {
    const onUnauthorized = () => {
      setUser(null);
      setAccessToken(null);
      setRefreshToken(null);
      setActiveOrgId(null);
      setMfaChallenge(null);
      queryClient.clear();
    };

    const onRefreshed = async (e) => {
      if (e.detail?.accessToken) {
        setAccessToken(e.detail.accessToken);
        if (e.detail.refreshToken) setRefreshToken(e.detail.refreshToken);
        await fetchUserProfile();
      }
    };

    window.addEventListener(AUTH_EVENTS.UNAUTHORIZED, onUnauthorized);
    window.addEventListener(AUTH_EVENTS.TOKENS_REFRESHED, onRefreshed);

    return () => {
      window.removeEventListener(AUTH_EVENTS.UNAUTHORIZED, onUnauthorized);
      window.removeEventListener(AUTH_EVENTS.TOKENS_REFRESHED, onRefreshed);
    };
  }, [fetchUserProfile]);

  // Login action
  const login = useCallback(
    async (credentials) => {
      const data = await authService.login(credentials);

      if (data?.requiresMfa || data?.challengeId) {
        setMfaChallenge({
          challengeId: data.challengeId,
          email: credentials.email,
        });
        return { requiresMfa: true, challengeId: data.challengeId };
      }

      if (data?.accessToken) {
        setAccessToken(data.accessToken);
        setRefreshToken(data.refreshToken);
        setMfaChallenge(null);
        const profile = await fetchUserProfile();
        return { success: true, user: profile };
      }

      return data;
    },
    [fetchUserProfile]
  );

  // Verify MFA Challenge
  const verifyMfa = useCallback(
    async (code) => {
      if (!mfaChallenge?.challengeId) {
        throw new Error('No active MFA challenge found.');
      }

      const data = await authService.verifyMfa({
        challengeId: mfaChallenge.challengeId,
        code,
      });

      if (data?.accessToken) {
        setAccessToken(data.accessToken);
        setRefreshToken(data.refreshToken);
        setMfaChallenge(null);
        const profile = await fetchUserProfile();
        return { success: true, user: profile };
      }

      return data;
    },
    [mfaChallenge, fetchUserProfile]
  );

  // Register Phone & OTP verification
  const registerPhone = useCallback(async (payload) => {
    return authService.registerPhone(payload);
  }, []);

  const verifyOtp = useCallback(
    async (payload) => {
      const data = await authService.verifyOtp(payload);
      if (data?.accessToken) {
        setAccessToken(data.accessToken);
        setRefreshToken(data.refreshToken);
        const profile = await fetchUserProfile();
        return { success: true, user: profile };
      }
      return data;
    },
    [fetchUserProfile]
  );

  // Logout action
  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      setAccessToken(null);
      setRefreshToken(null);
      setActiveOrgId(null);
      setMfaChallenge(null);
      queryClient.clear();
    }
  }, []);

  // Switch or set Active Organization
  const switchOrganization = useCallback((orgId) => {
    setActiveOrgId(orgId || null);
    setStoredActiveOrgId(orgId || null);
  }, []);

  // Active Organization object from user.organizations
  const activeOrg = useMemo(() => {
    if (!user?.organizations || !activeOrgId) return null;
    return user.organizations.find((o) => o.organizationId === activeOrgId) || null;
  }, [user, activeOrgId]);

  // Context flags
  const isAuthenticated = useMemo(() => !!user && !!accessToken, [user, accessToken]);
  const hasOrgContext = useMemo(() => !!activeOrg || (user?.organizations && user.organizations.length > 0), [activeOrg, user]);
  const isAdmin = useMemo(() => !!user?.adminProfile, [user]);

  // Role verification helper
  const hasRole = useCallback(
    (requiredRole) => {
      if (!user) return false;

      const roles = [];
      if (user.adminProfile?.role) roles.push(user.adminProfile.role);
      if (activeOrg?.role) roles.push(activeOrg.role);

      if (Array.isArray(requiredRole)) {
        return requiredRole.some((r) => roles.includes(r));
      }
      return roles.includes(requiredRole);
    },
    [user, activeOrg]
  );

  // Permission verification helper
  const hasPermission = useCallback(
    (requiredPermission) => {
      if (!user) return false;

      const permissions = [
        ...(user.adminProfile?.permissions || []),
        ...(activeOrg?.permissions || []),
      ];

      if (Array.isArray(requiredPermission)) {
        return requiredPermission.some((p) => permissions.includes(p));
      }
      return permissions.includes(requiredPermission);
    },
    [user, activeOrg]
  );

  const clearMfaChallenge = useCallback(() => {
    setMfaChallenge(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      tokens: { accessToken, refreshToken },
      activeOrgId,
      activeOrg,
      organizations: user?.organizations || [],
      isAuthenticated,
      isLoading,
      mfaChallenge,
      hasOrgContext,
      isAdmin,
      login,
      verifyMfa,
      registerPhone,
      verifyOtp,
      logout,
      switchOrganization,
      refetchUser: fetchUserProfile,
      hasRole,
      hasPermission,
      clearMfaChallenge,
    }),
    [
      user,
      accessToken,
      refreshToken,
      activeOrgId,
      activeOrg,
      isAuthenticated,
      isLoading,
      mfaChallenge,
      hasOrgContext,
      isAdmin,
      login,
      verifyMfa,
      registerPhone,
      verifyOtp,
      logout,
      switchOrganization,
      fetchUserProfile,
      hasRole,
      hasPermission,
      clearMfaChallenge,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
