import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export type Language = "pt-BR" | "pt-PT" | "en" | "es" | "fr" | "it";
export type MeasurementSystem = "metric" | "imperial";

interface SettingsContextType {
  language: Language;
  measurementSystem: MeasurementSystem;
  setLanguage: (language: Language) => void;
  setMeasurementSystem: (system: MeasurementSystem) => void;
  isLoading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const isValidLanguage = (value: string | null): value is Language => {
  return ["pt-BR", "pt-PT", "en", "es", "fr", "it"].includes(value || "");
};

const isValidMeasurementSystem = (value: string | null): value is MeasurementSystem => {
  return value === "metric" || value === "imperial";
};

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  const [language, setLanguageState] = useState<Language>(() => {
    const stored = localStorage.getItem("app-language");
    return isValidLanguage(stored) ? stored : "pt-BR";
  });

  const [measurementSystem, setMeasurementSystemState] = useState<MeasurementSystem>(() => {
    const stored = localStorage.getItem("app-measurement-system");
    return isValidMeasurementSystem(stored) ? stored : "metric";
  });

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
          .select("language, measurement_system")
          .eq("user_id", user.id)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          if (isValidLanguage(data.language)) {
            setLanguageState(data.language);
            localStorage.setItem("app-language", data.language);
          }
          if (isValidMeasurementSystem(data.measurement_system)) {
            setMeasurementSystemState(data.measurement_system);
            localStorage.setItem("app-measurement-system", data.measurement_system);
          }
        }
      } catch (error) {
        console.error("Error loading settings preferences:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPreferences();
  }, [user]);

  // Save preferences to database
  const savePreferences = useCallback(async (newLanguage?: Language, newMeasurementSystem?: MeasurementSystem) => {
    if (!user) return;

    const updates: { language?: string; measurement_system?: string } = {};
    if (newLanguage !== undefined) updates.language = newLanguage;
    if (newMeasurementSystem !== undefined) updates.measurement_system = newMeasurementSystem;

    try {
      await supabase
        .from("profiles")
        .update(updates)
        .eq("user_id", user.id);
    } catch (error) {
      console.error("Error saving settings preferences:", error);
    }
  }, [user]);

  const setLanguage = useCallback((newLanguage: Language) => {
    setLanguageState(newLanguage);
    localStorage.setItem("app-language", newLanguage);
    savePreferences(newLanguage, undefined);
  }, [savePreferences]);

  const setMeasurementSystem = useCallback((newSystem: MeasurementSystem) => {
    setMeasurementSystemState(newSystem);
    localStorage.setItem("app-measurement-system", newSystem);
    savePreferences(undefined, newSystem);
  }, [savePreferences]);

  return (
    <SettingsContext.Provider value={{ language, measurementSystem, setLanguage, setMeasurementSystem, isLoading }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};

export const LANGUAGES: { value: Language; label: string; flag: string }[] = [
  { value: "pt-BR", label: "Português (Brasil)", flag: "🇧🇷" },
  { value: "pt-PT", label: "Português (Portugal)", flag: "🇵🇹" },
  { value: "en", label: "English", flag: "🇺🇸" },
  { value: "es", label: "Español", flag: "🇪🇸" },
  { value: "fr", label: "Français", flag: "🇫🇷" },
  { value: "it", label: "Italiano", flag: "🇮🇹" },
];

export const MEASUREMENT_SYSTEMS: { value: MeasurementSystem; label: string; description: string }[] = [
  { value: "metric", label: "Métrico", description: "gramas, ml, °C" },
  { value: "imperial", label: "Imperial", description: "oz, cups, °F" },
];
