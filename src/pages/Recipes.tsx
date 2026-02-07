import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRecipes, useToggleFavorite } from "@/hooks/useRecipes";
import RecipeCard from "@/components/recipes/RecipeCard";

const Recipes = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { data: recipes, isLoading } = useRecipes();
  const toggleFavorite = useToggleFavorite();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  if (authLoading || isLoading) {
    return (
      <div className="px-4 py-6">
        <h1 className="font-display text-4xl font-bold text-foreground mb-6">
          Minhas Receitas
        </h1>
        <div className="flex items-center justify-center py-16">
          <div className="animate-pulse text-muted-foreground">Carregando...</div>
        </div>
      </div>
    );
  }

  const handleToggleFavorite = (e: React.MouseEvent, id: string, currentStatus: boolean) => {
    e.stopPropagation();
    toggleFavorite.mutate({ id, isFavorite: !currentStatus });
  };

  return (
    <div className="px-4 py-6">
      <h1 className="font-display text-4xl font-bold text-foreground mb-6">
        Minhas Receitas
      </h1>
      
      {!recipes || recipes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-4">
            <BookOpen className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="font-display text-2xl text-foreground mb-2">
            Nenhuma receita ainda
          </h2>
          <p className="text-muted-foreground font-body text-sm max-w-xs">
            Toque no botão + para adicionar sua primeira receita
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onClick={() => navigate(`/recipe/${recipe.id}`)}
              onToggleFavorite={(e) => handleToggleFavorite(e, recipe.id, recipe.is_favorite)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Recipes;
