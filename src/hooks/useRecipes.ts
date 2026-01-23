import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface Recipe {
  id: string;
  user_id: string;
  title: string;
  ingredients: string | null;
  instructions: string | null;
  image_url: string | null;
  source_url: string | null;
  category: string | null;
  servings: number | null;
  prep_time: number | null;
  cook_time: number | null;
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
}

export type RecipeInsert = Omit<Recipe, "id" | "created_at" | "updated_at">;
export type RecipeUpdate = Partial<Omit<Recipe, "id" | "user_id" | "created_at" | "updated_at">>;

export const useRecipes = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["recipes", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("recipes")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Recipe[];
    },
    enabled: !!user,
  });
};

export const useFavoriteRecipes = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["recipes", "favorites", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from("recipes")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_favorite", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Recipe[];
    },
    enabled: !!user,
  });
};

export const useRecipe = (id: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["recipe", id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from("recipes")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      return data as Recipe | null;
    },
    enabled: !!user && !!id,
  });
};

export const useCreateRecipe = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (recipe: Partial<Omit<RecipeInsert, "user_id">> & { title: string }) => {
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("recipes")
        .insert({
          title: recipe.title,
          ingredients: recipe.ingredients ?? null,
          instructions: recipe.instructions ?? null,
          image_url: recipe.image_url ?? null,
          source_url: recipe.source_url ?? null,
          category: recipe.category ?? null,
          servings: recipe.servings ?? null,
          prep_time: recipe.prep_time ?? null,
          cook_time: recipe.cook_time ?? null,
          is_favorite: recipe.is_favorite ?? false,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data as Recipe;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
    },
    onError: (error) => {
      toast.error("Erro ao salvar receita: " + error.message);
    },
  });
};

export const useUpdateRecipe = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: RecipeUpdate }) => {
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("recipes")
        .update(updates)
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) throw error;
      return data as Recipe;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
      queryClient.invalidateQueries({ queryKey: ["recipe", data.id] });
    },
    onError: (error) => {
      toast.error("Erro ao atualizar receita: " + error.message);
    },
  });
};

export const useDeleteRecipe = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from("recipes")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
      toast.success("Receita excluída!");
    },
    onError: (error) => {
      toast.error("Erro ao excluir receita: " + error.message);
    },
  });
};

export const useToggleFavorite = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ id, isFavorite }: { id: string; isFavorite: boolean }) => {
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("recipes")
        .update({ is_favorite: isFavorite })
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) throw error;
      return data as Recipe;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["recipes"] });
      queryClient.invalidateQueries({ queryKey: ["recipe", data.id] });
      toast.success(data.is_favorite ? "Adicionada aos favoritos!" : "Removida dos favoritos");
    },
    onError: (error) => {
      toast.error("Erro: " + error.message);
    },
  });
};
