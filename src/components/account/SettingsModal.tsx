import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useSettings, LANGUAGES, MEASUREMENT_SYSTEMS } from "@/contexts/SettingsContext";
import { Check, Globe, Ruler } from "lucide-react";
import { cn } from "@/lib/utils";

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SettingsModal = ({ open, onOpenChange }: SettingsModalProps) => {
  const { language, measurementSystem, setLanguage, setMeasurementSystem } = useSettings();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Configurações</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Language */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-muted-foreground" />
              <Label className="text-base font-medium">Idioma</Label>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.value}
                  onClick={() => setLanguage(lang.value)}
                  className={cn(
                    "flex items-center gap-2 p-3 rounded-lg border-2 transition-all text-left",
                    language === lang.value
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <span className="text-xl">{lang.flag}</span>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium truncate block">{lang.label}</span>
                  </div>
                  {language === lang.value && (
                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Measurement System */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Ruler className="w-5 h-5 text-muted-foreground" />
              <Label className="text-base font-medium">Sistema de Medidas</Label>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {MEASUREMENT_SYSTEMS.map((system) => (
                <button
                  key={system.value}
                  onClick={() => setMeasurementSystem(system.value)}
                  className={cn(
                    "flex flex-col items-center gap-1 p-4 rounded-lg border-2 transition-all",
                    measurementSystem === system.value
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <span className="text-sm font-medium">{system.label}</span>
                  <span className="text-xs text-muted-foreground">{system.description}</span>
                  {measurementSystem === system.value && (
                    <Check className="w-4 h-4 text-primary mt-1" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <Button onClick={() => onOpenChange(false)} className="w-full">
          Feito
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;
