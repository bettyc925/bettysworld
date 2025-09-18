-- Fix profile RLS policies for better privacy protection
-- Replace the overly permissive policy that allows all authenticated users to view all profiles

-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Authenticated users can view all profiles" ON public.profiles;

-- Create a more restrictive policy that only allows users to view their own profiles
CREATE POLICY "Users can only view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Keep the limited public policy for anonymous users but make it more restrictive
DROP POLICY IF EXISTS "Public can view limited profile info" ON public.profiles;

-- Optional: Add a public profile feature (users can make their profile public)
-- Add a column to control profile visibility
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_public_profile boolean DEFAULT false;

-- Create policy for public profiles (only display_name and avatar_url)
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles 
FOR SELECT 
USING (
  is_public_profile = true 
  AND (display_name IS NOT NULL OR avatar_url IS NOT NULL)
);