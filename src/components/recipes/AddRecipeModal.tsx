import { useState } from "react";
import { Link2, PenLine, Camera } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import AddRecipeUrlModal from "./AddRecipeUrlModal";

interface AddRecipeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddRecipeModal = ({ open, onOpenChange }: AddRecipeModalProps) => {
  const navigate = useNavigate();
  const [urlModalOpen, setUrlModalOpen] = useState(false);

  const options = [
    {
      icon: Link2,
      title: "Colar URL",
      description: "Importe uma receita de um site",
      action: () => {
        onOpenChange(false);
        setUrlModalOpen(true);
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
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-sm mx-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-3xl font-bold tracking-widest text-center uppercase">
              Nova Receita
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {options.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.title}
                  onClick={option.action}
                  className="flex items-center gap-4 p-5 rounded-xl bg-muted/60 hover:bg-muted transition-colors text-left group"
                >
                  <div className="w-12 h-12 flex items-center justify-center">
                    <Icon className="w-7 h-7 text-[hsl(15,50%,55%)]" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-display text-xl uppercase tracking-wider text-foreground font-bold">
                      {option.title}
                    </h3>
                    <p className="text-sm text-muted-foreground/60 font-body">
                      {option.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>

      <AddRecipeUrlModal open={urlModalOpen} onOpenChange={setUrlModalOpen} />
    </>
  );
};

export default AddRecipeModal;
