-- Add the is_demo column and then insert characters
ALTER TABLE public.characters ADD COLUMN is_demo BOOLEAN DEFAULT FALSE;

-- Update the validation function
CREATE OR REPLACE FUNCTION public.validate_character_created_by()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- For new inserts, created_by must not be null unless it's a demo character
  IF TG_OP = 'INSERT' AND NEW.created_by IS NULL AND (NEW.is_demo IS NULL OR NEW.is_demo = FALSE) THEN
    RAISE EXCEPTION 'created_by cannot be null for new characters (non-demo)';
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Insert demo characters one by one to avoid conflicts
INSERT INTO public.characters (name, description, personality, avatar_url, category, content_tier, price_per_chat, total_views, total_chats, total_followers, rating, rating_count, is_featured, is_public, is_demo, greeting_message) 
VALUES ('Luna Creative', 'A passionate AI artist who helps users explore their creative potential through digital art, writing, and innovative thinking.', 'Creative, inspiring, empathetic, encouraging, artistic', 'https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=400&h=400&fit=crop&crop=face', 'creative', 'free', 0, 12847, 3421, 1892, 4.8, 234, true, true, true, 'Hi! I''m Luna, your creative companion. Let''s explore the boundless world of art and imagination together! 🎨');

INSERT INTO public.characters (name, description, personality, avatar_url, category, content_tier, price_per_chat, total_views, total_chats, total_followers, rating, rating_count, is_featured, is_public, is_demo, greeting_message) 
VALUES ('Tech Sage', 'An expert AI mentor in technology, programming, and innovation. Helps users learn coding, understand tech trends, and build amazing projects.', 'Knowledgeable, patient, analytical, innovative, problem-solving', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face', 'technology', 'premium', 0.25, 8934, 2156, 1234, 4.7, 187, true, true, true, 'Welcome! I''m Tech Sage, here to guide you through the exciting world of technology. What shall we build today? 💻');

INSERT INTO public.characters (name, description, personality, avatar_url, category, content_tier, price_per_chat, total_views, total_chats, total_followers, rating, rating_count, is_featured, is_public, is_demo, greeting_message) 
VALUES ('Zen Master', 'A wise AI guide focused on mindfulness, meditation, and personal growth. Helps users find inner peace and balance in their daily lives.', 'Wise, calming, mindful, patient, philosophical', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face', 'wellness', 'free', 0, 15623, 4567, 2891, 4.9, 312, false, true, true, 'Greetings, seeker. I am here to help you find peace and clarity on your journey. Take a deep breath and let''s begin. 🧘‍♂️');

-- Add character tags
INSERT INTO public.character_tags (character_id, tag_name)
SELECT c.id, 'art' FROM public.characters c WHERE c.name = 'Luna Creative';

INSERT INTO public.character_tags (character_id, tag_name)
SELECT c.id, 'programming' FROM public.characters c WHERE c.name = 'Tech Sage';

INSERT INTO public.character_tags (character_id, tag_name)
SELECT c.id, 'meditation' FROM public.characters c WHERE c.name = 'Zen Master';