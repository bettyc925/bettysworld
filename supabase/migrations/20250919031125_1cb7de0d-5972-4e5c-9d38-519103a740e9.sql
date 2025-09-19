-- Add analytics and popularity tracking tables for characters
-- Character views/interactions tracking
CREATE TABLE public.character_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  character_id UUID NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  interaction_type TEXT NOT NULL CHECK (interaction_type IN ('view', 'chat', 'like', 'follow', 'share')),
  session_id TEXT,
  user_agent TEXT,
  ip_address INET,
  duration_seconds INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Character popularity metrics (aggregated daily)
CREATE TABLE public.character_popularity (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  character_id UUID NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  total_views INTEGER DEFAULT 0,
  total_chats INTEGER DEFAULT 0,
  total_likes INTEGER DEFAULT 0,
  total_follows INTEGER DEFAULT 0,
  total_shares INTEGER DEFAULT 0,
  engagement_score DECIMAL(10,2) DEFAULT 0,
  avg_chat_duration DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(character_id, date)
);

-- Content creator profiles
CREATE TABLE public.creator_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  creator_name TEXT NOT NULL,
  creator_bio TEXT,
  website_url TEXT,
  social_links JSONB DEFAULT '{}',
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  subscriber_count INTEGER DEFAULT 0,
  total_character_views INTEGER DEFAULT 0,
  total_earnings DECIMAL(12,2) DEFAULT 0,
  content_tier TEXT DEFAULT 'free' CHECK (content_tier IN ('free', 'premium', 'exclusive')),
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Character follows/subscriptions
CREATE TABLE public.character_follows (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  character_id UUID NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
  follower_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  notification_enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(character_id, follower_id)
);

-- Character tags for better discoverability
CREATE TABLE public.character_tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  character_id UUID NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
  tag_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(character_id, tag_name)
);

-- Add new columns to characters table for content creators
ALTER TABLE public.characters 
ADD COLUMN IF NOT EXISTS featured_until TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS content_tier TEXT DEFAULT 'free' CHECK (content_tier IN ('free', 'premium', 'exclusive')),
ADD COLUMN IF NOT EXISTS price_per_chat DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_views INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_chats INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_followers INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS rating DECIMAL(3,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS rating_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'general',
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;

-- Enable RLS on new tables
ALTER TABLE public.character_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.character_popularity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.character_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.character_tags ENABLE ROW LEVEL SECURITY;

-- RLS Policies for character_analytics
CREATE POLICY "Analytics viewable by character creators and admins" 
ON public.character_analytics 
FOR SELECT 
USING (
  EXISTS (SELECT 1 FROM public.characters WHERE id = character_analytics.character_id AND created_by = auth.uid())
  OR auth.uid() IN (SELECT user_id FROM public.creator_profiles WHERE verification_status = 'verified')
);

CREATE POLICY "Users can log their own analytics" 
ON public.character_analytics 
FOR INSERT 
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- RLS Policies for character_popularity
CREATE POLICY "Popularity metrics viewable by creators" 
ON public.character_popularity 
FOR SELECT 
USING (
  EXISTS (SELECT 1 FROM public.characters WHERE id = character_popularity.character_id AND created_by = auth.uid())
);

-- RLS Policies for creator_profiles
CREATE POLICY "Creator profiles are publicly viewable" 
ON public.creator_profiles 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create their own creator profile" 
ON public.creator_profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own creator profile" 
ON public.creator_profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- RLS Policies for character_follows
CREATE POLICY "Users can view their own follows" 
ON public.character_follows 
FOR SELECT 
USING (auth.uid() = follower_id);

CREATE POLICY "Users can follow characters" 
ON public.character_follows 
FOR INSERT 
WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can unfollow characters" 
ON public.character_follows 
FOR DELETE 
USING (auth.uid() = follower_id);

-- RLS Policies for character_tags
CREATE POLICY "Tags are publicly viewable" 
ON public.character_tags 
FOR SELECT 
USING (true);

CREATE POLICY "Character creators can manage tags" 
ON public.character_tags 
FOR ALL 
USING (
  EXISTS (SELECT 1 FROM public.characters WHERE id = character_tags.character_id AND created_by = auth.uid())
);

-- Create indexes for performance
CREATE INDEX idx_character_analytics_character_id ON public.character_analytics(character_id);
CREATE INDEX idx_character_analytics_interaction_type ON public.character_analytics(interaction_type);
CREATE INDEX idx_character_analytics_created_at ON public.character_analytics(created_at);
CREATE INDEX idx_character_popularity_character_id ON public.character_popularity(character_id);
CREATE INDEX idx_character_popularity_date ON public.character_popularity(date);
CREATE INDEX idx_character_follows_character_id ON public.character_follows(character_id);
CREATE INDEX idx_character_follows_follower_id ON public.character_follows(follower_id);
CREATE INDEX idx_character_tags_character_id ON public.character_tags(character_id);
CREATE INDEX idx_character_tags_tag_name ON public.character_tags(tag_name);
CREATE INDEX idx_characters_category ON public.characters(category);
CREATE INDEX idx_characters_is_featured ON public.characters(is_featured);
CREATE INDEX idx_characters_total_views ON public.characters(total_views);

-- Function to update character popularity metrics
CREATE OR REPLACE FUNCTION public.update_character_popularity()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;

-- Create trigger for popularity updates
CREATE TRIGGER update_character_popularity_trigger
AFTER INSERT ON public.character_analytics
FOR EACH ROW
EXECUTE FUNCTION public.update_character_popularity();

-- Function to calculate engagement score
CREATE OR REPLACE FUNCTION public.calculate_engagement_score(character_uuid UUID)
RETURNS DECIMAL AS $$
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
$$ LANGUAGE plpgsql;

-- Add trigger to update character updated_at
CREATE TRIGGER update_character_popularity_updated_at
BEFORE UPDATE ON public.character_popularity
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_creator_profiles_updated_at
BEFORE UPDATE ON public.creator_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();