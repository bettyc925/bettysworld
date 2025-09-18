-- Fix 1: Consolidate conflicting RLS policies on profiles table
DROP POLICY IF EXISTS "Users can only view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;

-- Create a single comprehensive policy for profile viewing
CREATE POLICY "Profile access policy" ON public.profiles
FOR SELECT USING (
  auth.uid() = user_id OR 
  (is_public_profile = true AND (display_name IS NOT NULL OR avatar_url IS NOT NULL))
);

-- Fix 2: Remove created_by constraint temporarily to clean up data
ALTER TABLE public.characters ALTER COLUMN created_by DROP NOT NULL;

-- Delete characters with null created_by since we can't fix them without proper users
DELETE FROM public.characters WHERE created_by IS NULL;

-- Now make created_by NOT NULL to prevent future issues
ALTER TABLE public.characters ALTER COLUMN created_by SET NOT NULL;

-- Fix 3: Add validation trigger for character creation
CREATE OR REPLACE FUNCTION public.validate_character_creation()
RETURNS TRIGGER AS $$
BEGIN
  -- Validate character name length
  IF length(NEW.name) < 1 OR length(NEW.name) > 100 THEN
    RAISE EXCEPTION 'Character name must be between 1 and 100 characters';
  END IF;
  
  -- Validate description length if provided
  IF NEW.description IS NOT NULL AND length(NEW.description) > 1000 THEN
    RAISE EXCEPTION 'Character description must not exceed 1000 characters';
  END IF;
  
  -- Validate personality length if provided
  IF NEW.personality IS NOT NULL AND length(NEW.personality) > 2000 THEN
    RAISE EXCEPTION 'Character personality must not exceed 2000 characters';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for character validation
DROP TRIGGER IF EXISTS validate_character_creation_trigger ON public.characters;
CREATE TRIGGER validate_character_creation_trigger
  BEFORE INSERT OR UPDATE ON public.characters
  FOR EACH ROW EXECUTE FUNCTION public.validate_character_creation();

-- Fix 4: Add validation for profile updates
CREATE OR REPLACE FUNCTION public.validate_profile_update()
RETURNS TRIGGER AS $$
BEGIN
  -- Validate username length and format
  IF NEW.username IS NOT NULL THEN
    IF length(NEW.username) < 3 OR length(NEW.username) > 30 THEN
      RAISE EXCEPTION 'Username must be between 3 and 30 characters';
    END IF;
    
    IF NOT NEW.username ~ '^[a-zA-Z0-9_]+$' THEN
      RAISE EXCEPTION 'Username can only contain letters, numbers, and underscores';
    END IF;
  END IF;
  
  -- Validate display name length
  IF NEW.display_name IS NOT NULL AND length(NEW.display_name) > 50 THEN
    RAISE EXCEPTION 'Display name must not exceed 50 characters';
  END IF;
  
  -- Validate bio length
  IF NEW.bio IS NOT NULL AND length(NEW.bio) > 500 THEN
    RAISE EXCEPTION 'Bio must not exceed 500 characters';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for profile validation
DROP TRIGGER IF EXISTS validate_profile_update_trigger ON public.profiles;
CREATE TRIGGER validate_profile_update_trigger
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.validate_profile_update();