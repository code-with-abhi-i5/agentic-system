import React, { createContext, useContext, useState, useEffect } from "react";
import {
  apiLogin,
  apiRegister,
  apiLogout,
  apiGetMe,
  getAuthToken,
  getStoredUser,
} from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState("login"); // 'login' | 'signup'

  // Initialize session from localStorage
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = getAuthToken();
      const savedUser = getStoredUser();

      if (savedToken && savedUser) {
        setUser(savedUser);
        setToken(savedToken);
      }

      // Verify token in background
      if (savedToken) {
        try {
          const verified = await apiGetMe();
          if (verified) {
            setUser(verified);
          }
        } catch (e) {
          console.warn("Auth token validation error:", e);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const openAuthModal = (mode = "login") => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const login = async ({ email, password }) => {
    const result = await apiLogin({ email, password });
    setUser(result.user);
    setToken(result.accessToken);
    setIsAuthModalOpen(false);
    return result;
  };

  const register = async ({ name, email, password }) => {
    const result = await apiRegister({ name, email, password });
    setUser(result.user);
    setToken(result.accessToken);
    setIsAuthModalOpen(false);
    return result;
  };

  const logout = async () => {
    await apiLogout();
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        setAuthModalMode,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
