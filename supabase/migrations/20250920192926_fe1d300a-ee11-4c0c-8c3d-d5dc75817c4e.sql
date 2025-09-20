-- Fix creator profiles security vulnerability
-- Drop the overly permissive public policy
DROP POLICY IF EXISTS "Creator profiles are publicly viewable" ON public.creator_profiles;

-- Create restricted policy for creators to access their own full data
CREATE POLICY "Creators can view their own full profile" 
ON public.creator_profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create policy for public access to only non-sensitive fields
-- This will be used in conjunction with a view for safer public access
CREATE POLICY "Public can view basic creator info" 
ON public.creator_profiles 
FOR SELECT 
USING (
  verification_status = 'verified' 
  AND is_featured = true
);

-- Create a secure public view that excludes sensitive financial data
CREATE OR REPLACE VIEW public.public_creator_profiles AS
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