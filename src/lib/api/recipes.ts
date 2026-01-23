import { supabase } from '@/integrations/supabase/client';

export type ScrapedRecipe = {
  title: string;
  ingredients: string;
  instructions: string;
  prep_time?: number | null;
  cook_time?: number | null;
  servings?: number | null;
  category?: string | null;
  source_url?: string;
  image_url?: string | null;
};

type ScrapeResponse = {
  success: boolean;
  error?: string;
  data?: ScrapedRecipe;
};

export const recipesApi = {
  async scrapeFromUrl(url: string): Promise<ScrapeResponse> {
    const { data, error } = await supabase.functions.invoke('scrape-recipe', {
      body: { url },
    });

    if (error) {
      console.error('Error calling scrape-recipe:', error);
      return { success: false, error: error.message };
    }

    return data;
  },
};
