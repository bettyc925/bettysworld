-- Add the is_demo column if it doesn't exist
ALTER TABLE public.characters ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT FALSE;

-- Drop all existing triggers temporarily
DROP TRIGGER IF EXISTS validate_character_created_by_trigger ON public.characters;

-- Insert demo characters (checking if they don't already exist)
INSERT INTO public.characters (
  name, 
  description, 
  personality, 
  avatar_url, 
  category,
  is_demo
) 
SELECT * FROM (VALUES 
  ('Luna Creative', 'A passionate AI artist who helps users explore their creative potential.', 'Creative, inspiring, empathetic', 'https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=400&h=400&fit=crop&crop=face', 'creative', true),
  ('Tech Sage', 'An expert AI mentor in technology and programming.', 'Knowledgeable, patient, analytical', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face', 'technology', true),
  ('Zen Master', 'A wise guide for mindfulness and personal growth.', 'Wise, calming, mindful', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face', 'wellness', true)
) AS v(name, description, personality, avatar_url, category, is_demo)
WHERE NOT EXISTS (
  SELECT 1 FROM public.characters WHERE name = v.name
);

-- Update stats for demo characters
UPDATE public.characters 
SET 
  total_views = CASE name
    WHEN 'Luna Creative' THEN 12847
    WHEN 'Tech Sage' THEN 8934  
    WHEN 'Zen Master' THEN 15623
    ELSE 0
  END,
  total_chats = CASE name
    WHEN 'Luna Creative' THEN 3421
    WHEN 'Tech Sage' THEN 2156
    WHEN 'Zen Master' THEN 4567
    ELSE 0
  END,
  total_followers = CASE name
    WHEN 'Luna Creative' THEN 1892
    WHEN 'Tech Sage' THEN 1234
    WHEN 'Zen Master' THEN 2891
    ELSE 0
  END,
  rating = CASE name
    WHEN 'Luna Creative' THEN 4.8
    WHEN 'Tech Sage' THEN 4.7
    WHEN 'Zen Master' THEN 4.9
    ELSE 0
  END,
  is_featured = CASE name
    WHEN 'Luna Creative' THEN true
    WHEN 'Tech Sage' THEN true
    ELSE false
  END,
  is_public = true
WHERE is_demo = true;

-- Recreate the validation trigger  
CREATE TRIGGER validate_character_created_by_trigger
BEFORE INSERT ON public.characters
FOR EACH ROW
EXECUTE FUNCTION public.validate_character_created_by();