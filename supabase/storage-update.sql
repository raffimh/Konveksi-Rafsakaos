-- Update designs bucket to be public
UPDATE storage.buckets
SET public = true
WHERE id = 'designs';

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can upload design files" ON storage.objects;
DROP POLICY IF EXISTS "Users can view own designs" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view design files" ON storage.objects;

-- Create new policies for public bucket
CREATE POLICY "Anyone can view design files"
ON storage.objects FOR SELECT
USING ( bucket_id = 'designs' );

CREATE POLICY "Users can upload design files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'designs'
  AND auth.role() = 'authenticated'
);