-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  avatar_url TEXT,
  location TEXT,
  phone TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Create listings table
CREATE TABLE IF NOT EXISTS public.listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  location TEXT NOT NULL,
  category TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Create RLS policies

-- Users table policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Allow users to read any profile
CREATE POLICY "Allow users to read any profile" ON public.users
  FOR SELECT USING (true);

-- Allow users to update their own profile
CREATE POLICY "Allow users to update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Allow users to insert their own profile
CREATE POLICY "Allow users to insert their own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Listings table policies
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read listings
CREATE POLICY "Allow anyone to read listings" ON public.listings
  FOR SELECT USING (true);

-- Allow authenticated users to create listings
CREATE POLICY "Allow authenticated users to create listings" ON public.listings
  FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

-- Allow users to update their own listings
CREATE POLICY "Allow users to update their own listings" ON public.listings
  FOR UPDATE USING (auth.uid() = user_id);

-- Allow users to delete their own listings
CREATE POLICY "Allow users to delete their own listings" ON public.listings
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS listings_user_id_idx ON public.listings (user_id);
CREATE INDEX IF NOT EXISTS listings_category_idx ON public.listings (category);
CREATE INDEX IF NOT EXISTS listings_location_idx ON public.listings (location);
CREATE INDEX IF NOT EXISTS listings_created_at_idx ON public.listings (created_at DESC);
CREATE INDEX IF NOT EXISTS listings_price_idx ON public.listings (price);

-- Create functions for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON public.users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_listings_updated_at
BEFORE UPDATE ON public.listings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
