CREATE TABLE public.category_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  category text NOT NULL,
  image_url text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, category)
);

ALTER TABLE public.category_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own category images"
  ON public.category_images FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own category images"
  ON public.category_images FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own category images"
  ON public.category_images FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own category images"
  ON public.category_images FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE TRIGGER update_category_images_updated_at
  BEFORE UPDATE ON public.category_images
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();