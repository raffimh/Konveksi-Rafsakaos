-- Create designs bucket
INSERT INTO storage.buckets (id, name)
VALUES ('designs', 'designs');

-- Set bucket as private
UPDATE storage.buckets
SET public = false
WHERE id = 'designs';

-- Allow authenticated users to upload designs with naming convention
CREATE POLICY "Users can upload their own designs"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'designs' AND
  auth.role() = 'authenticated' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to view their own designs
CREATE POLICY "Users can view their own designs"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'designs' AND
  (
    -- Users can view their own designs
    (storage.foldername(name))[1] = auth.uid()::text
    OR
    -- Admin can view all designs
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  )
);

-- Allow users to delete their own designs
CREATE POLICY "Users can delete their own designs"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'designs' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow admins full access to all designs
CREATE POLICY "Admins have full access to designs"
ON storage.objects FOR ALL
USING (
  bucket_id = 'designs' AND
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  )
);