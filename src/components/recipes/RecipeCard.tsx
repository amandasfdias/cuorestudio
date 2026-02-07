import { Heart, Clock, ChefHat } from "lucide-react";
import { Recipe } from "@/hooks/useRecipes";

interface RecipeCardProps {
  recipe: Recipe;
  onClick: () => void;
  onToggleFavorite: (e: React.MouseEvent) => void;
}

const RecipeCard = ({ recipe, onClick, onToggleFavorite }: RecipeCardProps) => {
  const totalTime = (recipe.prep_time || 0) + (recipe.cook_time || 0);

  return (
    <button
      onClick={onClick}
      className="relative aspect-[4/3] rounded-xl overflow-hidden group animate-fade-in"
    >
      {/* Background Image or Placeholder */}
      {recipe.image_url ? (
        <img
          src={recipe.image_url}
          alt={recipe.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 bg-warm-beige flex items-center justify-center">
          <ChefHat className="w-12 h-12 text-muted-foreground" />
        </div>
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      {/* Favorite Button */}
      <button
        onClick={onToggleFavorite}
        className="absolute top-3 right-3 p-2 rounded-full bg-background/80 backdrop-blur-sm transition-colors hover:bg-background"
      >
        <Heart
          className={`w-5 h-5 transition-colors ${
            recipe.is_favorite
              ? "fill-destructive text-destructive"
              : "text-foreground"
          }`}
        />
      </button>

      {/* Category Badge */}
      {recipe.category && (
        <span className="absolute top-3 left-3 text-xs font-body bg-background/80 backdrop-blur-sm text-foreground px-2 py-1 rounded-full">
          {recipe.category}
        </span>
      )}

      {/* Title and Info */}
      <div className="absolute bottom-0 left-0 right-0 p-4 text-left">
        <h3 className="font-display text-2xl text-white line-clamp-2 drop-shadow-md">
          {recipe.title}
        </h3>
        {totalTime > 0 && (
          <div className="flex items-center gap-1 mt-1 text-white/80">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-xs font-body">{totalTime} min</span>
          </div>
        )}
      </div>
    </button>
  );
};

export default RecipeCard;
