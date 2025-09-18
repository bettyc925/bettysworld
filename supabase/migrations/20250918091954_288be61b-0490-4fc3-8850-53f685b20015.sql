-- Fix security warning: Set search_path for function
-- Update the validate_character_created_by function to include SET search_path

CREATE OR REPLACE FUNCTION validate_character_created_by()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- For new inserts, created_by must not be null
  IF TG_OP = 'INSERT' AND NEW.created_by IS NULL THEN
    RAISE EXCEPTION 'created_by cannot be null for new characters';
  END IF;
  
  RETURN NEW;
END;
$$;