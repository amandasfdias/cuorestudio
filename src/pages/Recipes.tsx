import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Search, X, ArrowLeft, Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRecipes, useToggleFavorite } from "@/hooks/useRecipes";
import RecipeCard from "@/components/recipes/RecipeCard";
import CategoryCard from "@/components/recipes/CategoryCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AddRecipeModal from "@/components/recipes/AddRecipeModal";
import { useCategoryImages, useUpdateCategoryImage } from "@/hooks/useCategoryImages";
import { toast } from "sonner";

import categorySalgados from "@/assets/category-salgados.jpg";
import categoryDoces from "@/assets/category-doces.jpg";
import categoryPadaria from "@/assets/category-padaria.jpg";
import categoryBebidas from "@/assets/category-bebidas.jpg";
import categoryFit from "@/assets/category-fit.jpg";

const CATEGORIES = [
  { name: "Salgados", image: categorySalgados },
  { name: "Doces", image: categoryDoces },
  { name: "Padaria", image: categoryPadaria },
  { name: "Bebidas", image: categoryBebidas },
  { name: "Fit", image: categoryFit },
];

const Recipes = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { data: recipes, isLoading } = useRecipes();
  const toggleFavorite = useToggleFavorite();
  const { data: customImages } = useCategoryImages();
  const updateCategoryImage = useUpdateCategoryImage();
  const [uploadingCategory, setUploadingCategory] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);

  const handleCategoryImageChange = async (category: string, file: File) => {
    setUploadingCategory(category);
    try {
      await updateCategoryImage.mutateAsync({ category, file });
      toast.success("Imagem atualizada!");
    } catch {
      toast.error("Erro ao atualizar imagem");
    } finally {
      setUploadingCategory(null);
    }
  };
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    CATEGORIES.forEach((c) => (counts[c.name] = 0));
    recipes?.forEach((r) => {
      if (r.category && counts[r.category] !== undefined) {
        counts[r.category]++;
      }
    });
    return counts;
  }, [recipes]);

  const recentRecipes = useMemo(() => {
    return recipes?.slice(0, 4) ?? [];
  }, [recipes]);

  const filteredRecipes = useMemo(() => {
    let result = recipes ?? [];
    if (selectedCategory) {
      result = result.filter((r) => r.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((r) => r.title.toLowerCase().includes(q));
    }
    return result;
  }, [recipes, selectedCategory, searchQuery]);

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

  const handleCategoryClick = (category: string) => {
    setSelectedCategory((prev) => (prev === category ? null : category));
  };

  return (
    <div className="px-4 py-6 pb-24">
      <h1 className="font-display text-4xl font-bold text-foreground mb-4">
        Minhas Receitas
      </h1>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Pesquisar receitas..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-10 h-11 rounded-xl bg-card border-border font-body"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* If searching or filtering by category, show filtered results */}
      {(searchQuery || selectedCategory) ? (
        <>
          {selectedCategory && !searchQuery && (
            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={() => setSelectedCategory(null)}
                className="w-9 h-9 rounded-full bg-muted flex items-center justify-center"
              >
                <ArrowLeft className="w-5 h-5 text-foreground" />
              </button>
              <div className="flex-1">
                <h2 className="font-display text-3xl font-bold text-foreground">
                  {selectedCategory}
                </h2>
                <p className="text-muted-foreground font-body text-xs">
                  {filteredRecipes.length} {filteredRecipes.length === 1 ? "receita" : "receitas"}
                </p>
              </div>
            </div>
          )}

          {searchQuery && (
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-2xl text-foreground">
                Resultados
              </h2>
              <button
                onClick={() => { setSelectedCategory(null); setSearchQuery(""); }}
                className="text-sm font-body text-muted-foreground underline"
              >
                Limpar filtro
              </button>
            </div>
          )}

          {filteredRecipes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <BookOpen className="w-8 h-8 text-muted-foreground mb-2" />
              <p className="text-muted-foreground font-body text-sm">
                Nenhuma receita encontrada
              </p>
              {selectedCategory && (
                <Button
                  onClick={() => setAddModalOpen(true)}
                  className="mt-4 rounded-xl gap-2 font-body"
                >
                  <Plus className="w-4 h-4" />
                  Adicionar receita
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3">
                {filteredRecipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    onClick={() => navigate(`/recipe/${recipe.id}`)}
                    onToggleFavorite={(e) => handleToggleFavorite(e, recipe.id, recipe.is_favorite)}
                  />
                ))}
              </div>
              {selectedCategory && (
                <Button
                  onClick={() => setAddModalOpen(true)}
                  variant="outline"
                  className="w-full mt-4 h-12 rounded-xl border-2 border-dashed border-muted-foreground/30 font-body text-muted-foreground gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Adicionar receita em {selectedCategory}
                </Button>
              )}
            </>
          )}
        </>
      ) : (
        <>
          {/* Categories */}
          <section className="mb-8">
            <h2 className="font-display text-2xl text-foreground mb-3">
              Categorias
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {CATEGORIES.map((cat) => (
                <CategoryCard
                  key={cat.name}
                  name={cat.name}
                  image={cat.image}
                  count={categoryCounts[cat.name] || 0}
                  onClick={() => handleCategoryClick(cat.name)}
                />
              ))}
            </div>
          </section>

          {/* Recent Recipes */}
          <section>
            <h2 className="font-display text-2xl text-foreground mb-3">
              Últimas Receitas
            </h2>
            {recentRecipes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-3">
                  <BookOpen className="w-7 h-7 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground font-body text-sm">
                  Nenhuma receita ainda
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {recentRecipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    onClick={() => navigate(`/recipe/${recipe.id}`)}
                    onToggleFavorite={(e) => handleToggleFavorite(e, recipe.id, recipe.is_favorite)}
                  />
                ))}
              </div>
            )}
          </section>
        </>
      )}

      <AddRecipeModal open={addModalOpen} onOpenChange={setAddModalOpen} />
    </div>
  );
};

export default Recipes;
