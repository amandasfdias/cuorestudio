import { Link2, PenLine, Camera } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

interface AddRecipeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddRecipeModal = ({ open, onOpenChange }: AddRecipeModalProps) => {
  const navigate = useNavigate();

  const options = [
    {
      icon: Link2,
      title: "Colar URL",
      description: "Importe uma receita de um site",
      action: () => {
        onOpenChange(false);
        navigate("/add-recipe/url");
      },
    },
    {
      icon: PenLine,
      title: "Adicionar Manualmente",
      description: "Escreva sua própria receita",
      action: () => {
        onOpenChange(false);
        navigate("/add-recipe/manual");
      },
    },
    {
      icon: Camera,
      title: "Digitalizar Foto",
      description: "Escaneie uma receita com a câmera",
      action: () => {
        onOpenChange(false);
        navigate("/add-recipe/scan");
      },
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm mx-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-3xl text-center">
            Nova Receita
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-3 py-4">
          {options.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.title}
                onClick={option.action}
                className="flex items-center gap-4 p-4 rounded-lg bg-secondary hover:bg-accent transition-colors text-left group"
              >
                <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center group-hover:bg-warm-beige transition-colors">
                  <Icon className="w-5 h-5 text-foreground" />
                </div>
                <div>
                  <h3 className="font-display text-xl text-foreground">
                    {option.title}
                  </h3>
                  <p className="text-sm text-muted-foreground font-body">
                    {option.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddRecipeModal;
