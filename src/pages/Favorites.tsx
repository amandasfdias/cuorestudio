import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Clock, ChefHat, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useFavoriteRecipes, useToggleFavorite } from "@/hooks/useRecipes";

const Favorites = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { data: favorites, isLoading } = useFavoriteRecipes();
  const toggleFavorite = useToggleFavorite();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  const handleToggleFavorite = (e: React.MouseEvent, id: string, currentStatus: boolean) => {
    e.stopPropagation();
    toggleFavorite.mutate({ id, isFavorite: !currentStatus });
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
        <Heart className="w-6 h-6 text-destructive fill-destructive" />
        <h1 className="font-display text-4xl font-bold text-foreground">
          Favoritas
        </h1>
      </div>

      {!favorites || favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-4">
            <Heart className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="font-display text-2xl text-foreground mb-2">
            Nenhuma favorita ainda
          </h2>
          <p className="text-muted-foreground font-body text-sm max-w-xs">
            Toque no coração de uma receita para adicioná-la aqui
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {favorites.map((recipe) => (
            <button
              key={recipe.id}
              onClick={() => navigate(`/recipe/${recipe.id}`)}
              className="bg-secondary rounded-lg p-4 text-left hover:bg-accent transition-colors animate-fade-in"
            >
              <div className="flex gap-4">
                {recipe.image_url ? (
                  <img
                    src={recipe.image_url}
                    alt={recipe.title}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-lg bg-warm-beige flex items-center justify-center">
                    <ChefHat className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-display text-xl text-foreground truncate">
                      {recipe.title}
                    </h3>
                    <button
                      onClick={(e) => handleToggleFavorite(e, recipe.id, recipe.is_favorite)}
                      className="flex-shrink-0"
                    >
                      <Heart className="w-5 h-5 fill-destructive text-destructive" />
                    </button>
                  </div>
                  {recipe.category && (
                    <span className="text-xs text-muted-foreground font-body bg-background px-2 py-0.5 rounded-full">
                      {recipe.category}
                    </span>
                  )}
                  {(recipe.prep_time || recipe.cook_time) && (
                    <div className="flex items-center gap-1 mt-2 text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span className="text-xs font-body">
                        {(recipe.prep_time || 0) + (recipe.cook_time || 0)} min
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
