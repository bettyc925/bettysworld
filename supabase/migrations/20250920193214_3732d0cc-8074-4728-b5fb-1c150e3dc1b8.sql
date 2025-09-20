-- Fix the security definer view issue by recreating without SECURITY DEFINER
DROP VIEW IF EXISTS public.public_creator_profiles;

-- Create a regular view (not security definer) that excludes sensitive financial data
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
WHERE verification_status = 'verified' AND is_featured = true;

-- Enable RLS on the view is not needed as it inherits from the base table
-- Grant access to the view
GRANT SELECT ON public.public_creator_profiles TO anon, authenticated;