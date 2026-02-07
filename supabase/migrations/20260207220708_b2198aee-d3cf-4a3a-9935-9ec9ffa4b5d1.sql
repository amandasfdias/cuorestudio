-- Add theme preferences columns to profiles table
ALTER TABLE public.profiles
ADD COLUMN theme_mode text DEFAULT 'system',
ADD COLUMN theme_color text DEFAULT 'terracotta';

-- Add check constraints for valid values
ALTER TABLE public.profiles
ADD CONSTRAINT profiles_theme_mode_check CHECK (theme_mode IN ('light', 'dark', 'system')),
ADD CONSTRAINT profiles_theme_color_check CHECK (theme_color IN ('terracotta', 'sage', 'ocean', 'lavender', 'coral', 'charcoal'));