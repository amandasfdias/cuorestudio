import { useState } from "react";
import { Link2, Instagram, Facebook, Globe, Loader2, ClipboardPaste, ArrowLeft } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { recipesApi } from "@/lib/api/recipes";
import { useCreateRecipe } from "@/hooks/useRecipes";

interface AddRecipeUrlModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.1a8.16 8.16 0 0 0 3.76.92V5.58a4.83 4.83 0 0 1-0-.01z"/>
  </svg>
);

const YouTubeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

type ModalMode = "url" | "paste";

const AddRecipeUrlModal = ({ open, onOpenChange }: AddRecipeUrlModalProps) => {
  const [url, setUrl] = useState("");
  const [pastedText, setPastedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<ModalMode>("url");
  const navigate = useNavigate();
  const createRecipe = useCreateRecipe();

  const handleReset = () => {
    setUrl("");
    setPastedText("");
    setMode("url");
    setIsLoading(false);
  };

  const handleClose = (open: boolean) => {
    if (!open) handleReset();
    onOpenChange(open);
  };

  const saveRecipe = async (recipeData: any) => {
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
    handleReset();
    onOpenChange(false);

    if (newRecipe?.id) {
      navigate(`/recipe/${newRecipe.id}`);
    } else {
      navigate("/recipes");
    }
  };

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      toast.error("Por favor, insira uma URL");
      return;
    }

    setIsLoading(true);

    try {
      const response = await recipesApi.scrapeFromUrl(url);

      if (!response.success || !response.data) {
        if (response.unsupported) {
          setMode("paste");
          toast.info("Site não suportado. Cole o texto da receita abaixo.");
        } else {
          toast.error(response.error || "Não foi possível importar a receita");
        }
        return;
      }

      await saveRecipe(response.data);
    } catch (error) {
      console.error("Error importing recipe:", error);
      toast.error("Erro ao importar receita. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pastedText.trim()) {
      toast.error("Por favor, cole o texto da receita");
      return;
    }

    setIsLoading(true);

    try {
      const response = await recipesApi.extractFromText(pastedText);

      if (!response.success || !response.data) {
        toast.error(response.error || "Não foi possível extrair a receita do texto");
        return;
      }

      await saveRecipe(response.data);
    } catch (error) {
      console.error("Error extracting recipe:", error);
      toast.error("Erro ao processar receita. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const platforms = [
    { icon: Instagram, name: "Instagram", color: "text-pink-500" },
    { icon: Facebook, name: "Facebook", color: "text-blue-600" },
    { component: TikTokIcon, name: "TikTok", color: "text-foreground" },
    { component: YouTubeIcon, name: "YouTube", color: "text-red-500" },
    { icon: Globe, name: "Sites", color: "text-muted-foreground" },
  ];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-sm mx-auto rounded-2xl">
        <DialogHeader>
          <div className="flex items-center justify-center mb-3">
            {mode === "url" ? (
              <Link2 className="w-10 h-10 text-muted-foreground" strokeWidth={1.5} />
            ) : (
              <ClipboardPaste className="w-10 h-10 text-muted-foreground" strokeWidth={1.5} />
            )}
          </div>
          <DialogTitle className="font-display text-xl tracking-widest text-center uppercase">
            {mode === "url" ? "Importar Receita" : "Colar Receita"}
          </DialogTitle>
        </DialogHeader>

        {mode === "url" ? (
          <>
            <p className="text-muted-foreground font-body text-sm text-center">
              Cole o link de uma receita e importaremos automaticamente os ingredientes e instruções.
            </p>

            <p className="text-muted-foreground/70 font-body text-xs text-center italic mb-2">
              <span className="font-semibold not-italic">Dica:</span> Funciona melhor quando a receita está incluída na descrição ou na legenda do vídeo.
            </p>

            <div className="flex items-center justify-center gap-5 mb-2">
              {platforms.map((platform) => {
                const Icon = platform.icon;
                const CustomIcon = (platform as any).component;
                return (
                  <div
                    key={platform.name}
                    className="flex flex-col items-center gap-1.5"
                    title={platform.name}
                  >
                    {CustomIcon ? (
                      <CustomIcon className={`w-7 h-7 ${platform.color}`} />
                    ) : Icon ? (
                      <Icon className={`w-7 h-7 ${platform.color}`} strokeWidth={1.5} />
                    ) : null}
                    <span className="text-[10px] text-muted-foreground">{platform.name}</span>
                  </div>
                );
              })}
            </div>

            <form onSubmit={handleUrlSubmit} className="space-y-4">
              <Input
                type="url"
                placeholder="https://exemplo.com/receita"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="h-12 rounded-xl border-2 border-foreground/80 focus-visible:ring-foreground/30"
                autoFocus
                disabled={isLoading}
              />
              <Button
                type="submit"
                className="w-full h-12 rounded-xl bg-foreground text-background hover:bg-foreground/90 font-body text-base"
                disabled={isLoading}
              >
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
          </>
        ) : (
          <>
            <p className="text-muted-foreground font-body text-sm text-center">
              O site não é suportado para importação automática. Cole o texto da receita abaixo e extrairemos as informações com IA.
            </p>

            <form onSubmit={handleTextSubmit} className="space-y-4">
              <Textarea
                placeholder="Cole aqui o texto da receita (ingredientes, modo de preparo, etc.)"
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                className="min-h-[180px] rounded-xl border-2 border-foreground/80 focus-visible:ring-foreground/30 resize-none font-body text-sm"
                autoFocus
                disabled={isLoading}
              />
              <Button
                type="submit"
                className="w-full h-12 rounded-xl bg-foreground text-background hover:bg-foreground/90 font-body text-base"
                disabled={isLoading || !pastedText.trim()}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Extraindo receita...
                  </>
                ) : (
                  "Extrair Receita"
                )}
              </Button>
              <button
                type="button"
                onClick={() => setMode("url")}
                className="flex items-center gap-1.5 mx-auto text-sm text-muted-foreground hover:text-foreground transition-colors font-body"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar para importação por URL
              </button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddRecipeUrlModal;
