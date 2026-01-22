import { useState, useEffect } from "react";
import { ArrowLeft, Pencil } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useRecipe, useUpdateRecipe } from "@/hooks/useRecipes";

const EditRecipe = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { data: recipe, isLoading } = useRecipe(id || "");
  const updateRecipe = useUpdateRecipe();
  
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [category, setCategory] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [servings, setServings] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (recipe) {
      setTitle(recipe.title || "");
      setIngredients(recipe.ingredients || "");
      setInstructions(recipe.instructions || "");
      setCategory(recipe.category || "");
      setPrepTime(recipe.prep_time?.toString() || "");
      setCookTime(recipe.cook_time?.toString() || "");
      setServings(recipe.servings?.toString() || "");
      setSourceUrl(recipe.source_url || "");
    }
  }, [recipe]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !id) return;

    await updateRecipe.mutateAsync({
      id,
      updates: {
        title: title.trim(),
        ingredients: ingredients.trim() || null,
        instructions: instructions.trim() || null,
        category: category.trim() || null,
        prep_time: prepTime ? parseInt(prepTime) : null,
        cook_time: cookTime ? parseInt(cookTime) : null,
        servings: servings ? parseInt(servings) : null,
        source_url: sourceUrl.trim() || null,
      },
    });

    navigate(`/recipe/${id}`);
  };

  if (authLoading || isLoading) {
    return (
      <div className="px-6 py-8">
        <div className="flex items-center justify-center py-16">
          <div className="animate-pulse text-muted-foreground">Carregando...</div>
        </div>
      </div>
    );
  }

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
        <Pencil className="w-6 h-6 text-foreground" />
        <h1 className="font-display text-4xl font-bold text-foreground">
          Editar Receita
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-body text-muted-foreground mb-2">
            Título da Receita *
          </label>
          <Input
            type="text"
            placeholder="Ex: Bolo de Chocolate"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="h-12"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-body text-muted-foreground mb-2">
            Categoria
          </label>
          <Input
            type="text"
            placeholder="Ex: Doces, Salgados, Bebidas..."
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-12"
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-body text-muted-foreground mb-2">
              Preparo (min)
            </label>
            <Input
              type="number"
              placeholder="15"
              value={prepTime}
              onChange={(e) => setPrepTime(e.target.value)}
              className="h-12"
            />
          </div>
          <div>
            <label className="block text-sm font-body text-muted-foreground mb-2">
              Cozimento (min)
            </label>
            <Input
              type="number"
              placeholder="30"
              value={cookTime}
              onChange={(e) => setCookTime(e.target.value)}
              className="h-12"
            />
          </div>
          <div>
            <label className="block text-sm font-body text-muted-foreground mb-2">
              Porções
            </label>
            <Input
              type="number"
              placeholder="4"
              value={servings}
              onChange={(e) => setServings(e.target.value)}
              className="h-12"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-body text-muted-foreground mb-2">
            Link Original
          </label>
          <Input
            type="url"
            placeholder="https://..."
            value={sourceUrl}
            onChange={(e) => setSourceUrl(e.target.value)}
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

        <Button 
          type="submit" 
          className="w-full h-12" 
          disabled={updateRecipe.isPending || !title.trim()}
        >
          {updateRecipe.isPending ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </form>
    </div>
  );
};

export default EditRecipe;
