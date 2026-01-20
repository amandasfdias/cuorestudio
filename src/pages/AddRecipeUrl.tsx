import { useState } from "react";
import { ArrowLeft, Link2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const AddRecipeUrl = () => {
  const navigate = useNavigate();
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      toast.error("Por favor, insira uma URL");
      return;
    }
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
        <Link2 className="w-6 h-6 text-foreground" />
        <h1 className="font-display text-4xl font-bold text-foreground">
          Importar URL
        </h1>
      </div>

      <p className="text-muted-foreground font-body mb-6">
        Cole o link de uma receita e importaremos automaticamente os ingredientes e instruções.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="url"
          placeholder="https://exemplo.com/receita"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="h-12"
        />
        <Button type="submit" className="w-full h-12">
          Importar Receita
        </Button>
      </form>
    </div>
  );
};

export default AddRecipeUrl;
