import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useCategoryImages = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["category_images", user?.id],
    queryFn: async () => {
      if (!user) return {};
      const { data, error } = await supabase
        .from("category_images")
        .select("*")
        .eq("user_id", user.id);

      if (error) throw error;

      const map: Record<string, string> = {};
      data?.forEach((row: any) => {
        map[row.category] = row.image_url;
      });
      return map;
    },
    enabled: !!user,
  });
};

export const useUpdateCategoryImage = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ category, file }: { category: string; file: File }) => {
      if (!user) throw new Error("Not authenticated");

      const ext = file.name.split(".").pop();
      const path = `${user.id}/${category.toLowerCase()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("recipe-images")
        .upload(path, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("recipe-images")
        .getPublicUrl(path);

      const imageUrl = urlData.publicUrl + "?t=" + Date.now();

      const { error: upsertError } = await supabase
        .from("category_images")
        .upsert(
          { user_id: user.id, category, image_url: imageUrl },
          { onConflict: "user_id,category" }
        );

      if (upsertError) throw upsertError;

      return imageUrl;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["category_images"] });
    },
  });
};
