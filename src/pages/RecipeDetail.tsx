import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, Clock, Users, Trash2, ExternalLink } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRecipe, useToggleFavorite, useDeleteRecipe } from "@/hooks/useRecipes";
import { Button } from "@/components/ui/button";
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

      <div className="px-6 py-6">
        {!recipe.image_url && (
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-body">Voltar</span>
          </button>
        )}

        <div className="flex items-start justify-between gap-4 mb-4">
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
          <span className="inline-block text-sm text-muted-foreground font-body bg-secondary px-3 py-1 rounded-full mb-4">
            {recipe.category}
          </span>
        )}

        <div className="flex flex-wrap gap-4 mb-6">
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
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ExternalLink className="w-4 h-4" />
            <span className="text-sm font-body underline">Ver receita original</span>
          </a>
        )}

        {recipe.ingredients && (
          <div className="mb-6">
            <h2 className="font-display text-2xl text-foreground mb-3">
              Ingredientes
            </h2>
            <div className="bg-secondary rounded-lg p-4">
              <pre className="font-body text-sm text-foreground whitespace-pre-wrap">
                {recipe.ingredients}
              </pre>
            </div>
          </div>
        )}

        {recipe.instructions && (
          <div className="mb-8">
            <h2 className="font-display text-2xl text-foreground mb-3">
              Modo de Preparo
            </h2>
            <div className="bg-secondary rounded-lg p-4">
              <pre className="font-body text-sm text-foreground whitespace-pre-wrap">
                {recipe.instructions}
              </pre>
            </div>
          </div>
        )}

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
