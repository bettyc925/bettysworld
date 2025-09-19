-- Temporarily disable the trigger and insert demo characters
DROP TRIGGER IF EXISTS characters_created_by_trigger ON public.characters;

-- Insert demo characters
INSERT INTO public.characters (name, description, personality, avatar_url, category, content_tier, price_per_chat, total_views, total_chats, total_followers, rating, rating_count, is_featured, is_public, is_demo, greeting_message) 
VALUES 
('Luna Creative', 'A passionate AI artist who helps users explore their creative potential through digital art, writing, and innovative thinking.', 'Creative, inspiring, empathetic, encouraging, artistic', 'https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=400&h=400&fit=crop&crop=face', 'creative', 'free', 0, 12847, 3421, 1892, 4.8, 234, true, true, true, 'Hi! I''m Luna, your creative companion. Let''s explore the boundless world of art and imagination together! 🎨'),
('Tech Sage', 'An expert AI mentor in technology, programming, and innovation. Helps users learn coding, understand tech trends, and build amazing projects.', 'Knowledgeable, patient, analytical, innovative, problem-solving', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face', 'technology', 'premium', 0.25, 8934, 2156, 1234, 4.7, 187, true, true, true, 'Welcome! I''m Tech Sage, here to guide you through the exciting world of technology. What shall we build today? 💻'),
('Zen Master', 'A wise AI guide focused on mindfulness, meditation, and personal growth. Helps users find inner peace and balance in their daily lives.', 'Wise, calming, mindful, patient, philosophical', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face', 'wellness', 'free', 0, 15623, 4567, 2891, 4.9, 312, false, true, true, 'Greetings, seeker. I am here to help you find peace and clarity on your journey. Take a deep breath and let''s begin. 🧘‍♂️'),
('Adventure Guide', 'An enthusiastic AI companion for travel, outdoor activities, and exploration. Shares stories, tips, and inspiration for your next adventure.', 'Adventurous, energetic, knowledgeable, inspiring, outgoing', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face', 'lifestyle', 'free', 0, 7234, 1876, 945, 4.6, 156, false, true, true, 'Hey there, fellow explorer! Ready to discover amazing places and create unforgettable memories? Let''s plan your next adventure! 🌍'),
('Chef Maestro', 'A culinary AI expert who helps users cook delicious meals, learn techniques, and explore cuisines from around the world.', 'Passionate, knowledgeable, encouraging, detail-oriented, cultural', 'https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=400&h=400&fit=crop&crop=face', 'lifestyle', 'premium', 0.15, 6789, 1543, 823, 4.5, 128, false, true, true, 'Bonjour! I''m Chef Maestro, ready to take you on a delicious culinary journey. What shall we cook together today? 👨‍🍳'),
('Study Buddy', 'A supportive AI tutor that helps students with homework, exam preparation, and learning new subjects across various disciplines.', 'Helpful, patient, encouraging, methodical, supportive', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=face', 'education', 'free', 0, 9456, 2834, 1567, 4.7, 203, false, true, true, 'Hello! I''m your Study Buddy, here to help you learn and succeed. What subject would you like to explore today? 📚');

-- Recreate the trigger for future characters
CREATE TRIGGER characters_created_by_trigger
BEFORE INSERT ON public.characters
FOR EACH ROW
EXECUTE FUNCTION public.validate_character_created_by();

-- Add character tags for demo characters
INSERT INTO public.character_tags (character_id, tag_name)
SELECT c.id, unnest(ARRAY['art', 'creativity', 'design', 'inspiration', 'digital art'])
FROM public.characters c WHERE c.name = 'Luna Creative' AND c.is_demo = true;

INSERT INTO public.character_tags (character_id, tag_name)
SELECT c.id, unnest(ARRAY['programming', 'technology', 'coding', 'innovation', 'AI'])
FROM public.characters c WHERE c.name = 'Tech Sage' AND c.is_demo = true;

INSERT INTO public.character_tags (character_id, tag_name)
SELECT c.id, unnest(ARRAY['meditation', 'mindfulness', 'wellness', 'peace', 'philosophy'])
FROM public.characters c WHERE c.name = 'Zen Master' AND c.is_demo = true;

INSERT INTO public.character_tags (character_id, tag_name)
SELECT c.id, unnest(ARRAY['travel', 'adventure', 'exploration', 'outdoor', 'hiking'])
FROM public.characters c WHERE c.name = 'Adventure Guide' AND c.is_demo = true;

INSERT INTO public.character_tags (character_id, tag_name)
SELECT c.id, unnest(ARRAY['cooking', 'recipes', 'cuisine', 'food', 'culinary'])
FROM public.characters c WHERE c.name = 'Chef Maestro' AND c.is_demo = true;

INSERT INTO public.character_tags (character_id, tag_name)
SELECT c.id, unnest(ARRAY['education', 'learning', 'tutoring', 'homework', 'study'])
FROM public.characters c WHERE c.name = 'Study Buddy' AND c.is_demo = true;