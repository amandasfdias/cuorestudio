import { ArrowLeft, Camera, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const AddRecipeScan = () => {
  const navigate = useNavigate();

  const handleCapture = () => {
    toast.success("Funcionalidade em breve!");
  };

  const handleUpload = () => {
    toast.success("Funcionalidade em breve!");
  };

  return (
    <div className="px-6 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-body">Voltar</span>
      </button>

      <div className="flex items-center gap-3 mb-6">
        <Camera className="w-6 h-6 text-foreground" />
        <h1 className="font-display text-4xl font-bold text-foreground">
          Digitalizar
        </h1>
      </div>

      <p className="text-muted-foreground font-body mb-8">
        Tire uma foto ou selecione uma imagem de uma receita para digitalizá-la automaticamente.
      </p>

      <div className="space-y-4">
        <Button onClick={handleCapture} className="w-full h-14 gap-3">
          <Camera className="w-5 h-5" />
          Tirar Foto
        </Button>
        
        <Button onClick={handleUpload} variant="outline" className="w-full h-14 gap-3">
          <Upload className="w-5 h-5" />
          Escolher da Galeria
        </Button>
      </div>

      <div className="mt-12 p-6 bg-secondary rounded-lg text-center">
        <div className="w-16 h-16 rounded-full bg-accent mx-auto flex items-center justify-center mb-4">
          <Camera className="w-7 h-7 text-muted-foreground" />
        </div>
        <h3 className="font-display text-xl text-foreground mb-2">
          Como funciona?
        </h3>
        <p className="text-muted-foreground font-body text-sm">
          Nossa IA irá analisar a imagem e extrair automaticamente os ingredientes e o modo de preparo.
        </p>
      </div>
    </div>
  );
};

export default AddRecipeScan;
