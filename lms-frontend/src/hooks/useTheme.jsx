import { createContext, useContext, useEffect, useMemo, useState } from "react";

const ThemeCtx = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    try {
      return localStorage.getItem("lms_dark") !== "0";
    } catch {
      return true;
    }
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("lms_dark", darkMode ? "1" : "0");
  }, [darkMode]);

  const value = useMemo(
    () => ({
      darkMode,
      toggleTheme: () => setDarkMode((d) => !d),
      setDarkMode,
    }),
    [darkMode]
  );

  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
};

export const useTheme = () => useContext(ThemeCtx);
