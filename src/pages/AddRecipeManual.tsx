import { useState, useEffect } from "react";
import { ArrowLeft, Camera, ImagePlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useCreateRecipe } from "@/hooks/useRecipes";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const CATEGORIES = [
  { value: "Salgados", label: "Salgados" },
  { value: "Doces", label: "Doces" },
  { value: "Padaria", label: "Padaria" },
  { value: "Bebidas", label: "Bebidas" },
  { value: "Fit", label: "Fit" },
];

const AddRecipeManual = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const createRecipe = useCreateRecipe();
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [category, setCategory] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [servings, setServings] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Por favor, selecione uma imagem válida");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("A imagem deve ter no máximo 5MB");
      return;
    }

    setUploading(true);
    setImagePreview(URL.createObjectURL(file));

    try {
      const ext = file.name.split(".").pop();
      const path = `${user?.id}/recipe-${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("recipe-images")
        .upload(path, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("recipe-images")
        .getPublicUrl(path);

      setImageUrl(urlData.publicUrl);
      toast.success("Imagem carregada!");
    } catch (error: any) {
      toast.error("Erro ao carregar imagem: " + error.message);
      setImagePreview("");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    await createRecipe.mutateAsync({
      title: title.trim(),
      ingredients: ingredients.trim() || null,
      instructions: instructions.trim() || null,
      category: category || null,
      prep_time: prepTime ? parseInt(prepTime) : null,
      cook_time: cookTime ? parseInt(cookTime) : null,
      servings: servings ? parseInt(servings) : null,
      image_url: imageUrl || null,
      source_url: null,
      is_favorite: false,
    });

    navigate("/recipes");
  };

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="px-6 pt-8 pb-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-body">Voltar</span>
        </button>

        <h1 className="font-display text-4xl font-bold text-foreground">
          Nova Receita
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="px-6 space-y-6">
        {/* Image Upload */}
        <label
          htmlFor="recipe-image-upload"
          className="block w-full aspect-[16/9] bg-secondary rounded-2xl overflow-hidden cursor-pointer relative group"
        >
          {imagePreview ? (
            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-muted-foreground">
              <ImagePlus className="w-10 h-10" />
              <span className="text-sm font-body">Adicionar foto</span>
            </div>
          )}
          {uploading && (
            <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
              <span className="text-sm text-muted-foreground animate-pulse">Carregando...</span>
            </div>
          )}
          <input
            id="recipe-image-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
            disabled={uploading}
          />
        </label>

        {/* Title */}
        <div>
          <label className="block text-xs font-body font-semibold text-muted-foreground uppercase tracking-widest mb-2">
            Título da Receita
          </label>
          <Input
            type="text"
            placeholder="Ex: Bolo de Chocolate"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="h-12 rounded-xl bg-secondary border-none"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-body font-semibold text-muted-foreground uppercase tracking-widest mb-2">
            Categoria
          </label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="h-12 rounded-xl bg-secondary border-none">
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Ingredients */}
        <div>
          <label className="block text-xs font-body font-semibold text-muted-foreground uppercase tracking-widest mb-2">
            Ingredientes
          </label>
          <Textarea
            placeholder="Liste os ingredientes, um por linha"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            rows={5}
            className="rounded-xl bg-secondary border-none resize-none"
          />
        </div>

        {/* Instructions */}
        <div>
          <label className="block text-xs font-body font-semibold text-muted-foreground uppercase tracking-widest mb-2">
            Instruções
          </label>
          <Textarea
            placeholder="Descreva o passo a passo"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            rows={6}
            className="rounded-xl bg-secondary border-none resize-none"
          />
        </div>

        {/* Time & Servings */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-body font-semibold text-muted-foreground uppercase tracking-widest mb-2">
              Preparo
            </label>
            <Input
              type="number"
              placeholder="min"
              value={prepTime}
              onChange={(e) => setPrepTime(e.target.value)}
              className="h-12 rounded-xl bg-secondary border-none"
            />
          </div>
          <div>
            <label className="block text-xs font-body font-semibold text-muted-foreground uppercase tracking-widest mb-2">
              Cozimento
            </label>
            <Input
              type="number"
              placeholder="min"
              value={cookTime}
              onChange={(e) => setCookTime(e.target.value)}
              className="h-12 rounded-xl bg-secondary border-none"
            />
          </div>
          <div>
            <label className="block text-xs font-body font-semibold text-muted-foreground uppercase tracking-widest mb-2">
              Porções
            </label>
            <Input
              type="number"
              placeholder="4"
              value={servings}
              onChange={(e) => setServings(e.target.value)}
              className="h-12 rounded-xl bg-secondary border-none"
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-12 rounded-xl"
          disabled={createRecipe.isPending || !title.trim()}
        >
          {createRecipe.isPending ? "Salvando..." : "Salvar Receita"}
        </Button>
      </form>
    </div>
  );
};

export default AddRecipeManual;
