-- Create profiles table in Supabase
-- Run this in the Supabase SQL Editor

-- Create a table for user profiles
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create a trigger to automatically create a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (new.id, new.email, COALESCE(new.raw_user_meta_data->>'role', 'user'));
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Set up Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow users to view all profiles
CREATE POLICY "Profiles are viewable by everyone" 
ON profiles FOR SELECT 
USING (true);

-- Allow users to update their own profiles
CREATE POLICY "Users can update their own profiles" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);

-- Allow authenticated users to insert profiles
CREATE POLICY "Users can insert profiles" 
ON profiles FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to delete profiles since UI restricts this to admin only
DROP POLICY IF EXISTS "Authenticated users can delete profiles" ON profiles;
CREATE POLICY "Authenticated users can delete profiles"
ON profiles FOR DELETE 
USING (auth.role() = 'authenticated');

-- Grant necessary permissions
GRANT DELETE ON profiles TO authenticated;
GRANT USAGE ON SCHEMA auth TO authenticated;