-- Add language and measurement system preferences to profiles
ALTER TABLE public.profiles
ADD COLUMN language text DEFAULT 'pt-BR',
ADD COLUMN measurement_system text DEFAULT 'metric';

-- Add constraints
ALTER TABLE public.profiles
ADD CONSTRAINT profiles_language_check CHECK (language IN ('pt-BR', 'pt-PT', 'en', 'es', 'fr', 'it')),
ADD CONSTRAINT profiles_measurement_system_check CHECK (measurement_system IN ('metric', 'imperial'));