import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get("/auth/profile/");
      setUser(data);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("accessToken")) fetchProfile();
  }, []);

  const login = async (credentials) => {
    const { data } = await api.post("/token/", credentials);
    localStorage.setItem("accessToken", data.access);
    localStorage.setItem("refreshToken", data.refresh);
    await fetchProfile();
  };

  const register = async (payload) => {
    await api.post("/auth/register/", payload);
    await login({ username: payload.username, password: payload.password });
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
  };

  const value = useMemo(() => ({ user, login, register, logout, refresh: fetchProfile }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
