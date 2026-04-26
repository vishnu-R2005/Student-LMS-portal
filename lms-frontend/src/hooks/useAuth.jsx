import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api, { setupAuthInterceptors } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get("/auth/profile/");
      setUser(data);
      return data;
    } catch {
      setUser(null);
      return null;
    }
  };

  useEffect(() => {
    setupAuthInterceptors({
      onAuthFailure: () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setUser(null);
      },
    });

    let isMounted = true;
    const initializeAuth = async () => {
      try {
        if (localStorage.getItem("accessToken")) {
          await fetchProfile();
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();
    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const { data } = await api.post("/token/", credentials);
      localStorage.setItem("accessToken", data.access);
      localStorage.setItem("refreshToken", data.refresh);
      return await fetchProfile();
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    await api.post("/auth/register/", payload);
    return await login({
      username: payload.username,
      password: payload.password,
    });
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      login,
      register,
      logout,
      refresh: fetchProfile,
      loading,
    }),
    [user, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);