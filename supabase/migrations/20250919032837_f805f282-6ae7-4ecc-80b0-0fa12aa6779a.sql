-- Make created_by nullable temporarily for demo characters
ALTER TABLE public.characters ALTER COLUMN created_by DROP NOT NULL;

-- Drop all triggers that might interfere
DROP TRIGGER IF EXISTS validate_character_created_by_trigger ON public.characters;

-- Now insert demo characters with proper structure
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
('Zen Master', 'A wise AI guide focused on mindfulness, meditation, and personal growth. Helps users find inner peace and balance in their daily lives.', 'Wise, calming, mindful, patient, philosophical', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face', 'wellness', 15623, 4567, 2891, 4.9, false, true, true)
ON CONFLICT (name) DO NOTHING;

-- Add back constraint with exception for demo characters  
CREATE TRIGGER validate_character_created_by_trigger
BEFORE INSERT ON public.characters
FOR EACH ROW
EXECUTE FUNCTION public.validate_character_created_by();