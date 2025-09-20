-- Fix the security definer view issue
-- Recreate the view without SECURITY DEFINER property
DROP VIEW IF EXISTS public.public_creator_profiles;

CREATE VIEW public.public_creator_profiles AS
SELECT 
  id,
  user_id,
  creator_name,
  creator_bio,
  website_url,
  social_links,
  verification_status,
  is_featured,
  content_tier,
  created_at,
  updated_at
FROM public.creator_profiles
WHERE verification_status = 'verified';

-- Grant public access to the view
GRANT SELECT ON public.public_creator_profiles TO anon, authenticated;