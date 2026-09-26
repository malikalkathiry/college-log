-- Migration: Remove username from profiles + add auto-profile trigger
-- 
-- Run this in Supabase SQL Editor to update the live database.

-- 1. Remove the username column if it exists
ALTER TABLE profiles DROP COLUMN IF EXISTS username;

-- 2. Ensure RLS is enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 3. Recreate insert policy (username no longer required)
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 4. Auto-create profile when a new user confirms email
--    This handles the case where email confirmation is enabled:
--    signUp() cannot create a profile (no session yet),
--    so the trigger creates it after the user confirms.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (new.id)
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
