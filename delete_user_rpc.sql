-- Create a function to delete a user from auth.users
CREATE OR REPLACE FUNCTION delete_user(user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Delete the user from auth.users which will cascade to profiles
  DELETE FROM auth.users WHERE id = user_id;
  
  -- If no rows were deleted, the user doesn't exist
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found';
  END IF;
END;
$$;