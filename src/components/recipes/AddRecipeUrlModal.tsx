import { useState } from "react";
import { Link2, Instagram, Facebook, Globe } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface AddRecipeUrlModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddRecipeUrlModal = ({ open, onOpenChange }: AddRecipeUrlModalProps) => {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      toast.error("Por favor, insira uma URL");
      return;
    }

    setIsLoading(true);
    // TODO: Implement URL scraping functionality
    setTimeout(() => {
      toast.success("Funcionalidade em breve!");
      setIsLoading(false);
      setUrl("");
      onOpenChange(false);
    }, 1000);
  };

  const platforms = [
    { icon: Instagram, name: "Instagram", color: "text-pink-500" },
    { icon: Facebook, name: "Facebook", color: "text-blue-600" },
    { icon: Globe, name: "TikTok", color: "text-foreground" },
    { icon: Globe, name: "Sites em geral", color: "text-muted-foreground" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm mx-auto">
        <DialogHeader>
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
              <Link2 className="w-6 h-6 text-foreground" />
            </div>
          </div>
          <DialogTitle className="font-display text-2xl text-center">
            Importar Receita
          </DialogTitle>
        </DialogHeader>

        <p className="text-muted-foreground font-body text-sm text-center mb-4">
          Cole o link de uma receita e importaremos automaticamente os ingredientes e instruções.
        </p>

        <div className="flex items-center justify-center gap-4 mb-4">
          {platforms.map((platform) => {
            const Icon = platform.icon;
            return (
              <div
                key={platform.name}
                className="flex flex-col items-center gap-1"
                title={platform.name}
              >
                <Icon className={`w-5 h-5 ${platform.color}`} />
                <span className="text-xs text-muted-foreground">{platform.name}</span>
              </div>
            );
          })}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="url"
            placeholder="https://exemplo.com/receita"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="h-12"
            autoFocus
          />
          <Button type="submit" className="w-full h-12" disabled={isLoading}>
            {isLoading ? "Importando..." : "Importar Receita"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddRecipeUrlModal;
