import { useState } from "react";
import { Link2, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { recipesApi } from "@/lib/api/recipes";
import { useCreateRecipe } from "@/hooks/useRecipes";
import instagramIcon from "@/assets/icons/instagram-handdrawn.png";
import facebookIcon from "@/assets/icons/facebook-handdrawn.png";
import tiktokIcon from "@/assets/icons/tiktok-handdrawn.png";
import globeIcon from "@/assets/icons/globe-handdrawn.png";

interface AddRecipeUrlModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddRecipeUrlModal = ({ open, onOpenChange }: AddRecipeUrlModalProps) => {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const createRecipe = useCreateRecipe();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      toast.error("Por favor, insira uma URL");
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await recipesApi.scrapeFromUrl(url);

      if (!response.success || !response.data) {
        toast.error(response.error || "Não foi possível importar a receita");
        return;
      }

      const recipeData = response.data;
      
      // Create the recipe in the database
      const newRecipe = await createRecipe.mutateAsync({
        title: recipeData.title,
        ingredients: recipeData.ingredients,
        instructions: recipeData.instructions,
        prep_time: recipeData.prep_time,
        cook_time: recipeData.cook_time,
        servings: recipeData.servings,
        category: recipeData.category,
        source_url: recipeData.source_url,
        image_url: recipeData.image_url,
      });

      toast.success("Receita importada com sucesso!");
      setUrl("");
      onOpenChange(false);
      
      // Navigate to the new recipe
      if (newRecipe?.id) {
        navigate(`/recipe/${newRecipe.id}`);
      } else {
        navigate("/recipes");
      }
    } catch (error) {
      console.error("Error importing recipe:", error);
      toast.error("Erro ao importar receita. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const platforms = [
    { icon: instagramIcon, name: "Instagram" },
    { icon: facebookIcon, name: "Facebook" },
    { icon: tiktokIcon, name: "TikTok" },
    { icon: globeIcon, name: "Sites" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm mx-auto">
        <DialogHeader>
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
              <Link2 className="w-6 h-6 text-foreground" />
            </div>
          </div>
          <DialogTitle className="font-display text-2xl text-center">
            Importar Receita
          </DialogTitle>
        </DialogHeader>

        <p className="text-muted-foreground font-body text-sm text-center mb-4">
          Cole o link de uma receita e importaremos automaticamente os ingredientes e instruções.
        </p>

        <div className="flex items-center justify-center gap-4 mb-4">
        {platforms.map((platform) => (
            <div
              key={platform.name}
              className="flex flex-col items-center gap-1.5 w-14"
              title={platform.name}
            >
              <img src={platform.icon} alt={platform.name} className="w-10 h-10 object-contain" />
              <span className="text-xs text-muted-foreground">{platform.name}</span>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="url"
            placeholder="https://exemplo.com/receita"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="h-12"
            autoFocus
            disabled={isLoading}
          />
          <Button type="submit" className="w-full h-12" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Importando...
              </>
            ) : (
              "Importar Receita"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddRecipeUrlModal;
