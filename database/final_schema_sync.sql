-- FINAL SCHEMA SYNCHRONIZATION & BUG FIXES
-- This script fixes the 404 (Testimonials) and 400 (Packs) errors by ensuring perfect alignment.

BEGIN;

-- 1. FIX TESTIMONIALS (Ensure table is visible and has correct columns)
CREATE TABLE IF NOT EXISTS testimonials (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  name TEXT NOT NULL,
  role TEXT,
  text TEXT NOT NULL,
  img TEXT
);

-- Ensure RLS and Grant Permissions
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read Testimonials" ON testimonials;
CREATE POLICY "Public Read Testimonials" ON testimonials FOR SELECT USING (true);
GRANT SELECT ON testimonials TO anon, authenticated;

-- 2. FIX PACKS (Ensure title and display_order columns exist)
-- Handle 'name' -> 'title' rename
DO $$ 
BEGIN 
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='packs' AND column_name='name') THEN
        ALTER TABLE packs RENAME COLUMN name TO title;
    END IF;
END $$;

-- Handle 'is_popular' -> 'highlight' rename
DO $$ 
BEGIN 
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='packs' AND column_name='is_popular') THEN
        ALTER TABLE packs RENAME COLUMN is_popular TO highlight;
    END IF;
END $$;

-- Add missing columns
ALTER TABLE packs ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;
ALTER TABLE packs ADD COLUMN IF NOT EXISTS highlight BOOLEAN DEFAULT false;
ALTER TABLE packs ADD COLUMN IF NOT EXISTS description TEXT;

-- Ensure RLS and Grant Permissions
ALTER TABLE packs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read packs" ON packs;
CREATE POLICY "Allow public read packs" ON packs FOR SELECT USING (true);
GRANT SELECT ON packs TO anon, authenticated;

-- 3. FIX BOOKINGS (Ensure all columns for the form exist)
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';

-- 4. RELOAD POSTGREST CACHE
-- This is critical to fix the "Could not find table" error
NOTIFY pgrst, 'reload schema';

COMMIT;
