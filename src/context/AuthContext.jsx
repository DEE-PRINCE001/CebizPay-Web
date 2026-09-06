import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { jwtDecode } from 'jwt-decode';
import { authService } from '../api/services/auth.service.js';
import {
  getStoredAccessToken,
  getStoredRefreshToken,
  getStoredActiveOrgId,
  setStoredTokens,
  setStoredActiveOrgId,
  clearStoredAuth,
  AUTH_EVENTS,
} from '../api/client.js';
import { queryClient } from '../lib/queryClient.js';

export const AuthContext = createContext(null);

/**
 * Normalizes claims from ASP.NET Core JWT format into a clean user object.
 */
function parseJwtUser(token) {
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);

    // Check expiration
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      return null;
    }

    // Extract roles (supports single string or array, standard or WS-Federation schema)
    const rawRoles =
      decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
      decoded.role ||
      decoded.roles ||
      [];
    const roles = Array.isArray(rawRoles) ? rawRoles : rawRoles ? [rawRoles] : [];

    // Extract permissions
    const rawPermissions = decoded.permission || decoded.permissions || [];
    const permissions = Array.isArray(rawPermissions) ? rawPermissions : rawPermissions ? [rawPermissions] : [];

    const id =
      decoded.sub ||
      decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ||
      decoded.nameid ||
      decoded.id ||
      '';

    const email =
      decoded.email ||
      decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] ||
      '';

    const firstName = decoded.given_name || decoded.firstName || '';
    const lastName = decoded.family_name || decoded.lastName || '';
    const name = decoded.name || `${firstName} ${lastName}`.trim() || email;

    const organizationId = decoded.organizationId || decoded.orgId || null;
    const kycStatus = decoded.kycStatus || decoded.kyc || null;

    return {
      id,
      email,
      name,
      firstName,
      lastName,
      roles,
      permissions,
      tokenOrganizationId: organizationId,
      kycStatus,
      rawDecoded: decoded,
    };
  } catch (err) {
    console.error('Failed to parse JWT user payload:', err);
    return null;
  }
}

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(() => getStoredAccessToken());
  const [refreshToken, setRefreshToken] = useState(() => getStoredRefreshToken());
  const [activeOrgId, setActiveOrgId] = useState(() => getStoredActiveOrgId());
  const [user, setUser] = useState(() => parseJwtUser(getStoredAccessToken()));
  const [isLoading, setIsLoading] = useState(true);
  const [mfaChallenge, setMfaChallenge] = useState(null);

  // Sync state when tokens change or when silent refresh finishes
  const handleTokensUpdated = useCallback((newAccessToken, newRefreshToken) => {
    setAccessToken(newAccessToken);
    if (newRefreshToken) setRefreshToken(newRefreshToken);
    const parsedUser = parseJwtUser(newAccessToken);
    setUser(parsedUser);

    // If activeOrgId is not explicitly set in storage, check token organizationId
    if (!getStoredActiveOrgId() && parsedUser?.tokenOrganizationId) {
      setActiveOrgId(parsedUser.tokenOrganizationId);
      setStoredActiveOrgId(parsedUser.tokenOrganizationId);
    }
  }, []);

  // Initialize and validate auth on app launch
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = getStoredAccessToken();
      const storedRefresh = getStoredRefreshToken();

      if (storedToken) {
        const parsed = parseJwtUser(storedToken);
        if (parsed) {
          setUser(parsed);
          setAccessToken(storedToken);
          setRefreshToken(storedRefresh);
          if (!activeOrgId && parsed.tokenOrganizationId) {
            setActiveOrgId(parsed.tokenOrganizationId);
            setStoredActiveOrgId(parsed.tokenOrganizationId);
          }
        } else if (storedRefresh) {
          // Access token expired, attempt immediate silent refresh
          try {
            const data = await authService.refreshToken(storedRefresh);
            if (data?.accessToken) {
              handleTokensUpdated(data.accessToken, data.refreshToken || storedRefresh);
            }
          } catch {
            clearStoredAuth();
            setUser(null);
            setAccessToken(null);
            setRefreshToken(null);
          }
        } else {
          clearStoredAuth();
          setUser(null);
          setAccessToken(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, [activeOrgId, handleTokensUpdated]);

  // Listen for global client auth events (e.g. 401 logout or silent background token refresh)
  useEffect(() => {
    const onUnauthorized = () => {
      setUser(null);
      setAccessToken(null);
      setRefreshToken(null);
      setActiveOrgId(null);
      setMfaChallenge(null);
      queryClient.clear();
    };

    const onRefreshed = (e) => {
      if (e.detail?.accessToken) {
        handleTokensUpdated(e.detail.accessToken, e.detail.refreshToken);
      }
    };

    window.addEventListener(AUTH_EVENTS.UNAUTHORIZED, onUnauthorized);
    window.addEventListener(AUTH_EVENTS.TOKENS_REFRESHED, onRefreshed);

    return () => {
      window.removeEventListener(AUTH_EVENTS.UNAUTHORIZED, onUnauthorized);
      window.removeEventListener(AUTH_EVENTS.TOKENS_REFRESHED, onRefreshed);
    };
  }, [handleTokensUpdated]);

  // Login action
  const login = async (credentials) => {
    const data = await authService.login(credentials);

    // Handle MFA Challenge
    if (data?.requiresMfa || data?.challengeId) {
      setMfaChallenge({
        challengeId: data.challengeId,
        email: credentials.email,
      });
      return { requiresMfa: true, challengeId: data.challengeId };
    }

    if (data?.accessToken) {
      handleTokensUpdated(data.accessToken, data.refreshToken);
      setMfaChallenge(null);
      return { success: true, user: parseJwtUser(data.accessToken) };
    }

    return data;
  };

  // Verify MFA Challenge
  const verifyMfa = async (code) => {
    if (!mfaChallenge?.challengeId) {
      throw new Error('No active MFA challenge found.');
    }

    const data = await authService.verifyMfa({
      challengeId: mfaChallenge.challengeId,
      code,
    });

    if (data?.accessToken) {
      handleTokensUpdated(data.accessToken, data.refreshToken);
      setMfaChallenge(null);
      return { success: true, user: parseJwtUser(data.accessToken) };
    }

    return data;
  };

  // Register Phone & OTP verification
  const registerPhone = async (payload) => {
    return authService.registerPhone(payload);
  };

  const verifyOtp = async (payload) => {
    const data = await authService.verifyOtp(payload);
    if (data?.accessToken) {
      handleTokensUpdated(data.accessToken, data.refreshToken);
      return { success: true, user: parseJwtUser(data.accessToken) };
    }
    return data;
  };

  // Logout action
  const logout = async () => {
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
  };

  // Switch or set Active Organization
  const switchOrganization = (orgId) => {
    setActiveOrgId(orgId || null);
    setStoredActiveOrgId(orgId || null);
  };

  // User Profile manual updater
  const updateUser = (updater) => {
    setUser((prev) => (typeof updater === 'function' ? updater(prev) : { ...prev, ...updater }));
  };

  // Role verification helper
  const hasRole = useCallback(
    (requiredRole) => {
      if (!user?.roles) return false;
      if (Array.isArray(requiredRole)) {
        return requiredRole.some((r) => user.roles.includes(r));
      }
      return user.roles.includes(requiredRole);
    },
    [user]
  );

  // Permission verification helper
  const hasPermission = useCallback(
    (requiredPermission) => {
      if (!user?.permissions) return false;
      if (Array.isArray(requiredPermission)) {
        return requiredPermission.some((p) => user.permissions.includes(p));
      }
      return user.permissions.includes(requiredPermission);
    },
    [user]
  );

  // Context flags
  const isAuthenticated = useMemo(() => !!user && !!accessToken, [user, accessToken]);
  const hasOrgContext = useMemo(() => !!activeOrgId || !!user?.tokenOrganizationId, [activeOrgId, user]);
  const isAdmin = useMemo(() => hasRole(['Admin', 'SuperAdmin', 'PlatformAdmin', 'ComplianceOfficer']), [hasRole]);

  const value = useMemo(
    () => ({
      user,
      tokens: { accessToken, refreshToken },
      activeOrgId,
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
      updateUser,
      hasRole,
      hasPermission,
      clearMfaChallenge: () => setMfaChallenge(null),
    }),
    [
      user,
      accessToken,
      refreshToken,
      activeOrgId,
      isAuthenticated,
      isLoading,
      mfaChallenge,
      hasOrgContext,
      isAdmin,
      hasRole,
      hasPermission,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
