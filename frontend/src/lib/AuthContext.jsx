import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { authApi } from "@/api/auth";
import { clearSession, saveSession } from "@/lib/session";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);
  const [authError, setAuthError] = useState(null);

  const checkUserAuth = useCallback(async () => {
    setIsLoadingAuth(true);
    setAuthError(null);
    try {
      const currentUser = await authApi.getCurrentUser();
      setUser(currentUser);
      setAuthChecked(true);
      return currentUser;
    } catch (error) {
      setUser(null);
      setAuthError({ type: "auth_required", message: error.message });
      setAuthChecked(true);
      return null;
    } finally {
      setIsLoadingAuth(false);
    }
  }, []);

  const loginAs = useCallback(async (session) => {
    saveSession(session);
    return checkUserAuth();
  }, [checkUserAuth]);

  const logout = useCallback(async () => {
    await authApi.logout().catch(() => {});
    clearSession();
    setUser(null);
    setAuthChecked(true);
  }, []);

  useEffect(() => {
    checkUserAuth();
  }, [checkUserAuth]);

  const value = useMemo(() => ({
    user,
    authError,
    authChecked,
    checkUserAuth,
    loginAs,
    logout,
    isLoadingAuth,
    isLoadingPublicSettings: false,
    isAuthenticated: Boolean(user),
    navigateToLogin: () => {
      if (window.location.pathname !== "/login") {
        window.location.assign("/login");
      }
    }
  }), [authChecked, authError, checkUserAuth, isLoadingAuth, loginAs, logout, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
