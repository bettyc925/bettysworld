-- Add is_demo column and make created_by nullable
ALTER TABLE public.characters 
  ALTER COLUMN created_by DROP NOT NULL,
  ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT FALSE;

-- Drop the validation trigger temporarily  
DROP TRIGGER IF EXISTS validate_character_created_by_trigger ON public.characters;

-- Check if demo characters exist before inserting
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.characters WHERE name = 'Luna Creative') THEN
    INSERT INTO public.characters (
      name, 
      description, 
      personality, 
      avatar_url, 
      category,
      total_views,
      total_chats,
      total_followers,
      rating,
      is_featured,
      is_public,
      is_demo
    ) VALUES 
    ('Luna Creative', 'A passionate AI artist who helps users explore their creative potential through digital art, writing, and innovative thinking.', 'Creative, inspiring, empathetic, encouraging, artistic', 'https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=400&h=400&fit=crop&crop=face', 'creative', 12847, 3421, 1892, 4.8, true, true, true),
    ('Tech Sage', 'An expert AI mentor in technology, programming, and innovation. Helps users learn coding, understand tech trends, and build amazing projects.', 'Knowledgeable, patient, analytical, innovative, problem-solving', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face', 'technology', 8934, 2156, 1234, 4.7, true, true, true),
    ('Zen Master', 'A wise AI guide focused on mindfulness, meditation, and personal growth. Helps users find inner peace and balance in their daily lives.', 'Wise, calming, mindful, patient, philosophical', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face', 'wellness', 15623, 4567, 2891, 4.9, false, true, true);
  END IF;
END $$;

-- Update RLS policy to handle demo characters
DROP POLICY IF EXISTS "Public characters are viewable by everyone" ON public.characters;

CREATE POLICY "Public characters are viewable by everyone" 
ON public.characters 
FOR SELECT 
USING (
  (is_public = true AND (created_by IS NOT NULL OR is_demo = true)) 
  OR (auth.uid() = created_by)
);

-- Recreate the validation trigger with updated logic
CREATE TRIGGER validate_character_created_by_trigger
BEFORE INSERT ON public.characters
FOR EACH ROW
EXECUTE FUNCTION public.validate_character_created_by();