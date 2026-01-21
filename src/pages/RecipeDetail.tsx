import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, Clock, Users, Trash2, ExternalLink, Minus, Plus, StickyNote } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRecipe, useToggleFavorite, useDeleteRecipe } from "@/hooks/useRecipes";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const RecipeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { data: recipe, isLoading } = useRecipe(id || "");
  const toggleFavorite = useToggleFavorite();
  const deleteRecipe = useDeleteRecipe();
  const [multiplier, setMultiplier] = useState(1);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  const handleDelete = async () => {
    if (id) {
      await deleteRecipe.mutateAsync(id);
      navigate("/recipes");
    }
  };

  const parseIngredients = (ingredients: string) => {
    return ingredients
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
  };

  const parseInstructions = (instructions: string) => {
    return instructions
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
  };

  const applyMultiplier = (ingredient: string) => {
    if (multiplier === 1) return ingredient;
    
    // Match numbers (including decimals and fractions)
    return ingredient.replace(/(\d+([.,]\d+)?)/g, (match) => {
      const num = parseFloat(match.replace(",", "."));
      const result = num * multiplier;
      return result % 1 === 0 ? result.toString() : result.toFixed(1).replace(".", ",");
    });
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

  if (!recipe) {
    return (
      <div className="px-6 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-body">Voltar</span>
        </button>
        <p className="text-muted-foreground text-center py-16">Receita não encontrada</p>
      </div>
    );
  }

  const ingredientsList = recipe.ingredients ? parseIngredients(recipe.ingredients) : [];
  const instructionsList = recipe.instructions ? parseInstructions(recipe.instructions) : [];

  return (
    <div className="pb-8">
      {recipe.image_url && (
        <div className="relative h-48 w-full">
          <img
            src={recipe.image_url}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 w-10 h-10 rounded-full bg-background/80 backdrop-blur flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>
      )}

      <div className="px-6 py-6 space-y-8">
        {!recipe.image_url && (
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-body">Voltar</span>
          </button>
        )}

        <div className="flex items-start justify-between gap-4">
          <h1 className="font-display text-3xl font-bold text-foreground">
            {recipe.title}
          </h1>
          <button
            onClick={() => toggleFavorite.mutate({ id: recipe.id, isFavorite: !recipe.is_favorite })}
          >
            <Heart
              className={`w-6 h-6 transition-colors ${
                recipe.is_favorite
                  ? "fill-destructive text-destructive"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            />
          </button>
        </div>

        {recipe.category && (
          <span className="inline-block text-sm text-muted-foreground font-body bg-secondary px-3 py-1 rounded-full">
            {recipe.category}
          </span>
        )}

        <div className="flex flex-wrap gap-6">
          {(recipe.prep_time || recipe.cook_time) && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-body">
                {(recipe.prep_time || 0) + (recipe.cook_time || 0)} min
              </span>
            </div>
          )}
          {recipe.servings && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="w-4 h-4" />
              <span className="text-sm font-body">{recipe.servings} porções</span>
            </div>
          )}
        </div>

        {recipe.source_url && (
          <a
            href={recipe.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span className="text-sm font-body underline">Ver receita original</span>
          </a>
        )}

        {ingredientsList.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-2xl text-foreground">
                Ingredientes
              </h2>
              <div className="flex items-center gap-3 bg-secondary rounded-full px-3 py-1.5">
                <button
                  onClick={() => setMultiplier(Math.max(0.5, multiplier - 0.5))}
                  className="w-7 h-7 rounded-full bg-background flex items-center justify-center text-foreground hover:bg-muted transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-body text-sm font-medium min-w-[2rem] text-center">
                  {multiplier}x
                </span>
                <button
                  onClick={() => setMultiplier(multiplier + 0.5)}
                  className="w-7 h-7 rounded-full bg-background flex items-center justify-center text-foreground hover:bg-muted transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="bg-secondary rounded-lg p-5 space-y-3">
              {ingredientsList.map((ingredient, index) => (
                <div key={index} className="flex items-start gap-3">
                  <span className="text-sm flex-shrink-0">♥</span>
                  <span className="font-body text-sm text-foreground leading-relaxed">
                    {applyMultiplier(ingredient)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {instructionsList.length > 0 && (
          <div>
            <h2 className="font-display text-2xl text-foreground mb-4">
              Modo de Preparo
            </h2>
            <div className="space-y-4">
              {instructionsList.map((instruction, index) => (
                <div key={index} className="flex gap-4 bg-secondary rounded-lg p-4">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="font-display text-sm font-bold text-primary">
                      {index + 1}
                    </span>
                  </div>
                  <p className="font-body text-sm text-foreground leading-relaxed pt-1">
                    {instruction}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notes Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <StickyNote className="w-5 h-5 text-muted-foreground" />
            <h2 className="font-display text-2xl text-foreground">
              Notas
            </h2>
          </div>
          <div className="bg-accent/30 rounded-lg p-4 border-l-4 border-accent">
            <Textarea
              placeholder="Adicione suas anotações sobre esta receita..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[100px] bg-transparent border-none resize-none font-body text-sm placeholder:text-muted-foreground focus-visible:ring-0"
            />
          </div>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="w-full gap-2 text-destructive hover:text-destructive">
              <Trash2 className="w-4 h-4" />
              Excluir Receita
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="font-display text-2xl">Excluir receita?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação não pode ser desfeita. A receita será permanentemente removida.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default RecipeDetail;
