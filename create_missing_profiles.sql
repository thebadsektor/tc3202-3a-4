-- Script to create profile entries for existing users who don't have them
-- Run this in the Supabase SQL Editor after setting up the profiles table

-- Insert profiles for existing users who don't have a profile yet
INSERT INTO public.profiles (id, email, role)
SELECT 
  au.id, 
  au.email,
  COALESCE(au.raw_user_meta_data->>'role', 'user') as role
FROM 
  auth.users au
LEFT JOIN 
  public.profiles p ON au.id = p.id
WHERE 
  p.id IS NULL;

-- Verify the results
SELECT * FROM public.profiles;