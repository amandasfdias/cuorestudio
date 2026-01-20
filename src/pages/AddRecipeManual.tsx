import { useState } from "react";
import { ArrowLeft, PenLine } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const AddRecipeManual = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Por favor, insira um título");
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
        <PenLine className="w-6 h-6 text-foreground" />
        <h1 className="font-display text-4xl font-bold text-foreground">
          Nova Receita
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-body text-muted-foreground mb-2">
            Título da Receita
          </label>
          <Input
            type="text"
            placeholder="Ex: Bolo de Chocolate"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="h-12"
          />
        </div>

        <div>
          <label className="block text-sm font-body text-muted-foreground mb-2">
            Ingredientes
          </label>
          <Textarea
            placeholder="Liste os ingredientes, um por linha"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            rows={5}
          />
        </div>

        <div>
          <label className="block text-sm font-body text-muted-foreground mb-2">
            Modo de Preparo
          </label>
          <Textarea
            placeholder="Descreva o passo a passo"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            rows={6}
          />
        </div>

        <Button type="submit" className="w-full h-12">
          Salvar Receita
        </Button>
      </form>
    </div>
  );
};

export default AddRecipeManual;
