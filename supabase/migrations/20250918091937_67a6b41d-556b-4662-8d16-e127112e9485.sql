-- Fix data integrity: Update characters with null created_by to prevent orphaned data
-- For existing characters without created_by, we'll need to handle them appropriately
-- Since we can't determine the original creator, we'll either need to:
-- 1. Delete them (if they're test data)
-- 2. Assign them to a system user
-- 3. Make created_by nullable but add a check for new inserts

-- Let's make created_by required for new characters going forward
-- but allow existing ones to remain (they can be manually cleaned up later)
-- We'll add a check constraint to ensure new characters have created_by

-- First, let's see what characters exist
-- For security, we should ensure created_by is always set for new characters
-- Add a constraint that allows existing NULL values but requires created_by for new inserts

-- Add a check constraint that allows existing NULLs but requires created_by for new records
-- We'll use a trigger approach since CHECK constraints can't reference functions like now()

CREATE OR REPLACE FUNCTION validate_character_created_by()
RETURNS TRIGGER AS $$
BEGIN
  -- For new inserts, created_by must not be null
  IF TG_OP = 'INSERT' AND NEW.created_by IS NULL THEN
    RAISE EXCEPTION 'created_by cannot be null for new characters';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to validate created_by on insert
DROP TRIGGER IF EXISTS validate_character_created_by_trigger ON public.characters;
CREATE TRIGGER validate_character_created_by_trigger
  BEFORE INSERT ON public.characters
  FOR EACH ROW
  EXECUTE FUNCTION validate_character_created_by();