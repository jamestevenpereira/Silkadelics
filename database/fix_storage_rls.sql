-- Standardized Storage Policies (Idempotent)
-- Buckets: gallery, team-photos, testimonials (ALL LOWERCASE)

-- 1. GALLERY BUCKET
DROP POLICY IF EXISTS "Public Read Gallery" ON storage.objects;
CREATE POLICY "Public Read Gallery" ON storage.objects FOR SELECT USING (bucket_id = 'gallery');

DROP POLICY IF EXISTS "Authenticated Upload Gallery" ON storage.objects;
CREATE POLICY "Authenticated Upload Gallery" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'gallery');

DROP POLICY IF EXISTS "Authenticated Update Gallery" ON storage.objects;
CREATE POLICY "Authenticated Update Gallery" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'gallery');

DROP POLICY IF EXISTS "Authenticated Delete Gallery" ON storage.objects;
CREATE POLICY "Authenticated Delete Gallery" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'gallery');


-- 2. TEAM-PHOTOS BUCKET
DROP POLICY IF EXISTS "Public Read Team Photos" ON storage.objects;
CREATE POLICY "Public Read Team Photos" ON storage.objects FOR SELECT USING (bucket_id = 'team-photos');

DROP POLICY IF EXISTS "Authenticated Upload Team Photos" ON storage.objects;
CREATE POLICY "Authenticated Upload Team Photos" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'team-photos');

DROP POLICY IF EXISTS "Authenticated Update Team Photos" ON storage.objects;
CREATE POLICY "Authenticated Update Team Photos" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'team-photos');

DROP POLICY IF EXISTS "Authenticated Delete Team Photos" ON storage.objects;
CREATE POLICY "Authenticated Delete Team Photos" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'team-photos');


-- 3. TESTIMONIALS BUCKET
DROP POLICY IF EXISTS "Public Read Testimonials" ON storage.objects;
CREATE POLICY "Public Read Testimonials" ON storage.objects FOR SELECT USING (bucket_id = 'testimonials');

DROP POLICY IF EXISTS "Authenticated Upload Testimonials" ON storage.objects;
CREATE POLICY "Authenticated Upload Testimonials" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'testimonials');

DROP POLICY IF EXISTS "Authenticated Update Testimonials" ON storage.objects;
CREATE POLICY "Authenticated Update Testimonials" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'testimonials');

DROP POLICY IF EXISTS "Authenticated Delete Testimonials" ON storage.objects;
CREATE POLICY "Authenticated Delete Testimonials" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'testimonials');
