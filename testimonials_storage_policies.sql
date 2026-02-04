-- Políticas de Storage para o bucket Testimonials
-- Execute este SQL no Supabase SQL Editor

-- 1. Permitir INSERT (upload) para utilizadores autenticados
CREATE POLICY "Allow authenticated uploads to Testimonials"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'Testimonials');

-- 2. Permitir SELECT (leitura) para todos (público)
CREATE POLICY "Allow public read access to Testimonials"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'Testimonials');

-- 3. Permitir UPDATE para utilizadores autenticados
CREATE POLICY "Allow authenticated updates to Testimonials"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'Testimonials')
WITH CHECK (bucket_id = 'Testimonials');

-- 4. Permitir DELETE para utilizadores autenticados
CREATE POLICY "Allow authenticated deletes from Testimonials"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'Testimonials');
