-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('listings', 'listings', true)
ON CONFLICT (id) DO NOTHING;

-- Set up security policies for avatars bucket
CREATE POLICY "Allow public read access to avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Allow authenticated users to upload avatars"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' AND
  auth.role() = 'authenticated' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Allow users to update their own avatars"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars' AND
  auth.role() = 'authenticated' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Allow users to delete their own avatars"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars' AND
  auth.role() = 'authenticated' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Set up security policies for listings bucket
CREATE POLICY "Allow public read access to listings"
ON storage.objects FOR SELECT
USING (bucket_id = 'listings');

CREATE POLICY "Allow authenticated users to upload listing images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'listings' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Allow users to update their own listing images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'listings' AND
  auth.role() = 'authenticated' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Allow users to delete their own listing images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'listings' AND
  auth.role() = 'authenticated' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
