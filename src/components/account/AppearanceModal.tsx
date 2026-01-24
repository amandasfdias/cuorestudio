import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useTheme, THEME_COLORS, THEME_MODES } from "@/contexts/ThemeContext";
import { Check, Sun, Moon, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";

interface AppearanceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AppearanceModal = ({ open, onOpenChange }: AppearanceModalProps) => {
  const { mode, color, setMode, setColor } = useTheme();

  const getModeIcon = (modeValue: string) => {
    switch (modeValue) {
      case "light":
        return <Sun className="w-5 h-5" />;
      case "dark":
        return <Moon className="w-5 h-5" />;
      default:
        return <Monitor className="w-5 h-5" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Aparência</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Theme Mode */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Tema</Label>
            <div className="grid grid-cols-3 gap-3">
              {THEME_MODES.map((themeMode) => (
                <button
                  key={themeMode.value}
                  onClick={() => setMode(themeMode.value)}
                  className={cn(
                    "flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all",
                    mode === themeMode.value
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  {getModeIcon(themeMode.value)}
                  <span className="text-sm font-medium">{themeMode.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Color Palette */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Cor do tema</Label>
            <div className="grid grid-cols-3 gap-3">
              {THEME_COLORS.map((themeColor) => (
                <button
                  key={themeColor.value}
                  onClick={() => setColor(themeColor.value)}
                  className={cn(
                    "flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all",
                    color === themeColor.value
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: themeColor.hex }}
                  >
                    {color === themeColor.value && (
                      <Check className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <span className="text-xs font-medium">{themeColor.label}</span>
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

export default AppearanceModal;
