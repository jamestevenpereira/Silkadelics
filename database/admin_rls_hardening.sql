-- Admin Access Hardening Script
-- Restricts administrative actions solely to silkadelics@gmail.com

-- 1. Bookings
DROP POLICY IF EXISTS "Allow authenticated manage bookings" ON bookings;
CREATE POLICY "Allow admin manage bookings" ON bookings 
FOR ALL TO authenticated 
USING (auth.jwt() ->> 'email' = 'silkadelics@gmail.com');

-- 2. Packs
DROP POLICY IF EXISTS "Allow authenticated manage packs" ON packs;
CREATE POLICY "Allow admin manage packs" ON packs 
FOR ALL TO authenticated 
USING (auth.jwt() ->> 'email' = 'silkadelics@gmail.com');

-- 3. Gallery
DROP POLICY IF EXISTS "Allow authenticated manage gallery" ON gallery;
CREATE POLICY "Allow admin manage gallery" ON gallery 
FOR ALL TO authenticated 
USING (auth.jwt() ->> 'email' = 'silkadelics@gmail.com');

-- 4. Settings
DROP POLICY IF EXISTS "Allow authenticated manage settings" ON settings;
CREATE POLICY "Allow admin manage settings" ON settings 
FOR ALL TO authenticated 
USING (auth.jwt() ->> 'email' = 'silkadelics@gmail.com');

-- 5. Team
DROP POLICY IF EXISTS "Allow authenticated manage team" ON team;
CREATE POLICY "Allow admin manage team" ON team 
FOR ALL TO authenticated 
USING (auth.jwt() ->> 'email' = 'silkadelics@gmail.com');

-- 6. Repertoire
DROP POLICY IF EXISTS "Allow authenticated manage repertoire" ON repertoire;
CREATE POLICY "Allow admin manage repertoire" ON repertoire 
FOR ALL TO authenticated 
USING (auth.jwt() ->> 'email' = 'silkadelics@gmail.com');

-- 7. Testimonials (Admin part)
DROP POLICY IF EXISTS "Allow authenticated manage testimonials" ON testimonials;
CREATE POLICY "Allow admin manage testimonials" ON testimonials 
FOR ALL TO authenticated 
USING (auth.jwt() ->> 'email' = 'silkadelics@gmail.com');
