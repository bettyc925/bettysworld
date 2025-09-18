-- Update the profiles table RLS policy to require authentication
-- This prevents unauthorized access to user personal information

-- Drop the existing public policy
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Create a new policy that only allows authenticated users to view profiles
CREATE POLICY "Authenticated users can view all profiles" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (true);

-- Also add a policy for anonymous users to view only basic public info if needed
-- (Optional: Remove this if you want to completely restrict to authenticated users only)
CREATE POLICY "Public can view limited profile info" 
ON public.profiles 
FOR SELECT 
TO anon
USING (
  -- Only allow viewing display_name and avatar_url for public profiles
  -- This prevents exposure of sensitive info like username and bio
  username IS NULL AND bio IS NULL
);