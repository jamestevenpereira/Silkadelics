-- NOTE: We removed 'ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;' 
-- because it often causes permission errors if you are not the owner.
-- RLS is usually enabled by default on storage.objects.

-- 1. Policies for 'Gallery' Bucket

-- Allow Public Read
DROP POLICY IF EXISTS "Public Read Gallery" ON storage.objects;
CREATE POLICY "Public Read Gallery"
ON storage.objects FOR SELECT
USING ( bucket_id = 'Gallery' );

-- Allow Authenticated Upload
DROP POLICY IF EXISTS "Authenticated Upload Gallery" ON storage.objects;
CREATE POLICY "Authenticated Upload Gallery"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'Gallery' );

-- Allow Authenticated Update
DROP POLICY IF EXISTS "Authenticated Update Gallery" ON storage.objects;
CREATE POLICY "Authenticated Update Gallery"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'Gallery' );

-- Allow Authenticated Delete
DROP POLICY IF EXISTS "Authenticated Delete Gallery" ON storage.objects;
CREATE POLICY "Authenticated Delete Gallery"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'Gallery' );


-- 2. Policies for 'team-photos' Bucket

-- Allow Public Read
DROP POLICY IF EXISTS "Public Read Team Photos" ON storage.objects;
CREATE POLICY "Public Read Team Photos"
ON storage.objects FOR SELECT
USING ( bucket_id = 'team-photos' );

-- Allow Authenticated Upload
DROP POLICY IF EXISTS "Authenticated Upload Team Photos" ON storage.objects;
CREATE POLICY "Authenticated Upload Team Photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'team-photos' );

-- Allow Authenticated Update
DROP POLICY IF EXISTS "Authenticated Update Team Photos" ON storage.objects;
CREATE POLICY "Authenticated Update Team Photos"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'team-photos' );

-- Allow Authenticated Delete
DROP POLICY IF EXISTS "Authenticated Delete Team Photos" ON storage.objects;
CREATE POLICY "Authenticated Delete Team Photos"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'team-photos' );
