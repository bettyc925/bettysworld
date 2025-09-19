-- Fix function search path security warnings

-- Update the update_character_popularity function to set search_path
CREATE OR REPLACE FUNCTION public.update_character_popularity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update daily popularity metrics
  INSERT INTO public.character_popularity (character_id, date, total_views, total_chats, total_likes, total_follows, total_shares)
  VALUES (
    NEW.character_id,
    CURRENT_DATE,
    CASE WHEN NEW.interaction_type = 'view' THEN 1 ELSE 0 END,
    CASE WHEN NEW.interaction_type = 'chat' THEN 1 ELSE 0 END,
    CASE WHEN NEW.interaction_type = 'like' THEN 1 ELSE 0 END,
    CASE WHEN NEW.interaction_type = 'follow' THEN 1 ELSE 0 END,
    CASE WHEN NEW.interaction_type = 'share' THEN 1 ELSE 0 END
  )
  ON CONFLICT (character_id, date)
  DO UPDATE SET
    total_views = character_popularity.total_views + CASE WHEN NEW.interaction_type = 'view' THEN 1 ELSE 0 END,
    total_chats = character_popularity.total_chats + CASE WHEN NEW.interaction_type = 'chat' THEN 1 ELSE 0 END,
    total_likes = character_popularity.total_likes + CASE WHEN NEW.interaction_type = 'like' THEN 1 ELSE 0 END,
    total_follows = character_popularity.total_follows + CASE WHEN NEW.interaction_type = 'follow' THEN 1 ELSE 0 END,
    total_shares = character_popularity.total_shares + CASE WHEN NEW.interaction_type = 'share' THEN 1 ELSE 0 END,
    updated_at = now();

  -- Update character totals
  UPDATE public.characters 
  SET 
    total_views = COALESCE(total_views, 0) + CASE WHEN NEW.interaction_type = 'view' THEN 1 ELSE 0 END,
    total_chats = COALESCE(total_chats, 0) + CASE WHEN NEW.interaction_type = 'chat' THEN 1 ELSE 0 END,
    updated_at = now()
  WHERE id = NEW.character_id;

  RETURN NEW;
END;
$$;

-- Update the calculate_engagement_score function to set search_path
CREATE OR REPLACE FUNCTION public.calculate_engagement_score(character_uuid UUID)
RETURNS DECIMAL
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  views INTEGER;
  chats INTEGER;
  likes INTEGER;
  follows INTEGER;
  shares INTEGER;
  score DECIMAL;
BEGIN
  SELECT 
    COALESCE(total_views, 0),
    COALESCE(total_chats, 0),
    COALESCE((SELECT COUNT(*) FROM character_analytics WHERE character_id = character_uuid AND interaction_type = 'like'), 0),
    COALESCE(total_followers, 0),
    COALESCE((SELECT COUNT(*) FROM character_analytics WHERE character_id = character_uuid AND interaction_type = 'share'), 0)
  INTO views, chats, likes, follows, shares
  FROM characters 
  WHERE id = character_uuid;

  -- Calculate weighted engagement score
  score := (
    (views * 0.1) +
    (chats * 2.0) +
    (likes * 1.5) +
    (follows * 3.0) +
    (shares * 2.5)
  );

  RETURN COALESCE(score, 0);
END;
$$;