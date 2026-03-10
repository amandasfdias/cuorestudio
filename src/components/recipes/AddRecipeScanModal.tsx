import { Camera, ScanLine, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface AddRecipeScanModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddRecipeScanModal = ({ open, onOpenChange }: AddRecipeScanModalProps) => {
  const handleCapture = () => {
    toast.success("Funcionalidade em breve!");
  };

  const handleUpload = () => {
    toast.success("Funcionalidade em breve!");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm mx-auto rounded-2xl">
        <DialogHeader>
          <div className="flex items-center justify-center mb-3">
            <Camera className="w-10 h-10 text-muted-foreground" strokeWidth={1.5} />
          </div>
          <DialogTitle className="font-display text-xl tracking-widest text-center uppercase">
            Digitalizar Foto
          </DialogTitle>
        </DialogHeader>

        <p className="text-muted-foreground font-body text-sm text-center">
          Tire uma foto da sua receita ou selecione uma imagem da galeria para digitalizá-la automaticamente
        </p>

        <div className="space-y-3 mt-2">
          <Button
            onClick={handleCapture}
            className="w-full h-12 rounded-xl bg-foreground text-background hover:bg-foreground/90 font-body text-base gap-3"
          >
            <Camera className="w-5 h-5" />
            Tirar Foto
          </Button>

          <Button
            onClick={handleUpload}
            variant="outline"
            className="w-full h-12 rounded-xl border-2 border-foreground/80 font-body text-base gap-3"
          >
            <ScanLine className="w-5 h-5" />
            Escolher da Galeria
          </Button>
        </div>

        <div className="mt-2 p-4 bg-muted/60 rounded-xl text-center">
          <h3 className="font-display text-lg uppercase tracking-wider text-foreground font-bold mb-1">
            Como funciona?
          </h3>
          <p className="text-muted-foreground font-body text-sm">
            Nossa IA irá analisar a imagem e extrair automaticamente os ingredientes e o modo de preparo.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddRecipeScanModal;
