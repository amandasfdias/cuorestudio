import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type ThemeMode = "light" | "dark" | "system";
type ThemeColor = "terracotta" | "sage" | "ocean" | "lavender" | "coral" | "charcoal";

interface ThemeContextType {
  mode: ThemeMode;
  color: ThemeColor;
  setMode: (mode: ThemeMode) => void;
  setColor: (color: ThemeColor) => void;
  resolvedMode: "light" | "dark";
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

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    const stored = localStorage.getItem("theme-mode");
    return (stored as ThemeMode) || "system";
  });

  const [color, setColorState] = useState<ThemeColor>(() => {
    const stored = localStorage.getItem("theme-color");
    return (stored as ThemeColor) || "terracotta";
  });

  const [resolvedMode, setResolvedMode] = useState<"light" | "dark">("light");

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
    localStorage.setItem("theme-mode", newMode);
  };

  const setColor = (newColor: ThemeColor) => {
    setColorState(newColor);
    localStorage.setItem("theme-color", newColor);
  };

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
    <ThemeContext.Provider value={{ mode, color, setMode, setColor, resolvedMode }}>
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
