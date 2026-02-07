import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const THEME_STORAGE_KEY = "@theme_preference";

type Theme = {
  colors: {
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    primary: string;
    primaryVariant: string;
    error: string;
    success: string;
    warning: string;
    border: string;
    tabBarBackground: string;
    tabBarActive: string;
    tabBarInactive: string;
  };
};

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
  isLoading: boolean;
};

const lightTheme: Theme = {
  colors: {
    background: "#FFFFFF",
    surface: "#F5F5F5",
    text: "#1E1E1E",
    textSecondary: "#A9A9A9",
    primary: "#1E1E1E",
    primaryVariant: "#333333",
    error: "#FF3B30",
    success: "#34C759",
    warning: "#FF9500",
    border: "#E0E0E0",
    tabBarBackground: "#FFFFFF",
    tabBarActive: "#1E1E1E",
    tabBarInactive: "#A9A9A9",
  },
};

const darkTheme: Theme = {
  colors: {
    background: "#121212",
    surface: "#1E1E1E",
    text: "#FFFFFF",
    textSecondary: "#A9A9A9",
    primary: "#FFFFFF",
    primaryVariant: "#CCCCCC",
    error: "#FF6B6B",
    success: "#4CAF50",
    warning: "#FFB74D",
    border: "#333333",
    tabBarBackground: "#121212",
    tabBarActive: "#FFFFFF",
    tabBarInactive: "#A9A9A9",
  },
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDark, setIsDark] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const theme = isDark ? darkTheme : lightTheme;

  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme !== null) {
          setIsDark(savedTheme === "dark");
        }
      } catch (error) {
        console.error("Error loading theme preference:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadThemePreference();
  }, []);

  const toggleTheme = async () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newIsDark ? "dark" : "light");
    } catch (error) {
      console.error("Error saving theme preference:", error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark, isLoading }}>
      {children}
    </ThemeContext.Provider>
  );
};