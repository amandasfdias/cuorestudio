import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

type ThemeMode = "light" | "dark" | "system";
type ThemeColor = "terracotta" | "sage" | "ocean" | "lavender" | "coral" | "charcoal";

interface ThemeContextType {
  mode: ThemeMode;
  color: ThemeColor;
  setMode: (mode: ThemeMode) => void;
  setColor: (color: ThemeColor) => void;
  resolvedMode: "light" | "dark";
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const COLOR_PALETTES: Record<ThemeColor, { primary: string; primaryForeground: string }> = {
  terracotta: { primary: "15 36% 54%", primaryForeground: "0 0% 100%" },
  sage: { primary: "140 25% 45%", primaryForeground: "0 0% 100%" },
  ocean: { primary: "200 60% 45%", primaryForeground: "0 0% 100%" },
  lavender: { primary: "270 40% 55%", primaryForeground: "0 0% 100%" },
  coral: { primary: "16 80% 60%", primaryForeground: "0 0% 100%" },
  charcoal: { primary: "0 0% 25%", primaryForeground: "0 0% 100%" },
};

const isValidThemeMode = (value: string | null): value is ThemeMode => {
  return value === "light" || value === "dark" || value === "system";
};

const isValidThemeColor = (value: string | null): value is ThemeColor => {
  return ["terracotta", "sage", "ocean", "lavender", "coral", "charcoal"].includes(value || "");
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  
  const [mode, setModeState] = useState<ThemeMode>(() => {
    const stored = localStorage.getItem("theme-mode");
    return isValidThemeMode(stored) ? stored : "system";
  });

  const [color, setColorState] = useState<ThemeColor>(() => {
    const stored = localStorage.getItem("theme-color");
    return isValidThemeColor(stored) ? stored : "terracotta";
  });

  const [resolvedMode, setResolvedMode] = useState<"light" | "dark">("light");

  // Load preferences from database when user logs in
  useEffect(() => {
    const loadPreferences = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("theme_mode, theme_color")
          .eq("user_id", user.id)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          if (isValidThemeMode(data.theme_mode)) {
            setModeState(data.theme_mode);
            localStorage.setItem("theme-mode", data.theme_mode);
          }
          if (isValidThemeColor(data.theme_color)) {
            setColorState(data.theme_color);
            localStorage.setItem("theme-color", data.theme_color);
          }
        }
      } catch (error) {
        console.error("Error loading theme preferences:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPreferences();
  }, [user]);

  // Save preferences to database
  const savePreferences = useCallback(async (newMode?: ThemeMode, newColor?: ThemeColor) => {
    if (!user) return;

    const updates: { theme_mode?: string; theme_color?: string } = {};
    if (newMode !== undefined) updates.theme_mode = newMode;
    if (newColor !== undefined) updates.theme_color = newColor;

    try {
      await supabase
        .from("profiles")
        .update(updates)
        .eq("user_id", user.id);
    } catch (error) {
      console.error("Error saving theme preferences:", error);
    }
  }, [user]);

  const setMode = useCallback((newMode: ThemeMode) => {
    setModeState(newMode);
    localStorage.setItem("theme-mode", newMode);
    savePreferences(newMode, undefined);
  }, [savePreferences]);

  const setColor = useCallback((newColor: ThemeColor) => {
    setColorState(newColor);
    localStorage.setItem("theme-color", newColor);
    savePreferences(undefined, newColor);
  }, [savePreferences]);

  // Handle system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const updateResolvedMode = () => {
      if (mode === "system") {
        setResolvedMode(mediaQuery.matches ? "dark" : "light");
      } else {
        setResolvedMode(mode);
      }
    };

    updateResolvedMode();
    mediaQuery.addEventListener("change", updateResolvedMode);

    return () => mediaQuery.removeEventListener("change", updateResolvedMode);
  }, [mode]);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;

    // Apply dark/light mode
    root.classList.remove("light", "dark");
    root.classList.add(resolvedMode);

    // Apply color palette
    const palette = COLOR_PALETTES[color];
    root.style.setProperty("--primary", palette.primary);
    root.style.setProperty("--primary-foreground", palette.primaryForeground);
  }, [resolvedMode, color]);

  return (
    <ThemeContext.Provider value={{ mode, color, setMode, setColor, resolvedMode, isLoading }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const THEME_COLORS: { value: ThemeColor; label: string; hex: string }[] = [
  { value: "terracotta", label: "Terracota", hex: "#bb6f58" },
  { value: "sage", label: "Sálvia", hex: "#6b8f71" },
  { value: "ocean", label: "Oceano", hex: "#2d8fb8" },
  { value: "lavender", label: "Lavanda", hex: "#9b7bb8" },
  { value: "coral", label: "Coral", hex: "#eb7a5c" },
  { value: "charcoal", label: "Carvão", hex: "#404040" },
];

export const THEME_MODES: { value: ThemeMode; label: string }[] = [
  { value: "light", label: "Claro" },
  { value: "dark", label: "Escuro" },
  { value: "system", label: "Sistema" },
];
