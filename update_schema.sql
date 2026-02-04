-- Fix Storage RLS Policies
-- (Assuming storage extension is enabled. If this fails, run in SQL Editor)
-- We will try to create policies on storage.objects if possible, or user might need to do it manually.
-- For now, let's focus on the tables.

BEGIN;

-- 1. Create Testimonials Table
CREATE TABLE IF NOT EXISTS testimonials (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  text TEXT NOT NULL,
  img TEXT
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read testimonials" ON testimonials;
CREATE POLICY "Allow public read testimonials" ON testimonials FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow authenticated manage testimonials" ON testimonials;
CREATE POLICY "Allow authenticated manage testimonials" ON testimonials FOR ALL TO authenticated USING (true);

-- 2. Update Packs Table (Handle existing table)
-- Rename 'name' to 'title' if it exists
DO $$
BEGIN
  IF EXISTS(SELECT * FROM information_schema.columns WHERE table_name = 'packs' AND column_name = 'name') THEN
    ALTER TABLE packs RENAME COLUMN name TO title;
  END IF;
END $$;

-- Rename 'is_popular' to 'highlight' if it exists
DO $$
BEGIN
  IF EXISTS(SELECT * FROM information_schema.columns WHERE table_name = 'packs' AND column_name = 'is_popular') THEN
    ALTER TABLE packs RENAME COLUMN is_popular TO highlight;
  END IF;
END $$;

-- Add 'description' if it doesn't exist
ALTER TABLE packs ADD COLUMN IF NOT EXISTS description TEXT;

-- Add 'display_order' if it doesn't exist
ALTER TABLE packs ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Ensure RLS is enabled
ALTER TABLE packs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read packs" ON packs;
CREATE POLICY "Allow public read packs" ON packs FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow authenticated manage packs" ON packs;
CREATE POLICY "Allow authenticated manage packs" ON packs FOR ALL TO authenticated USING (true);

-- 3. Insert Default Packs (Idempotent)
-- We use ON CONFLICT DO NOTHING if we had a unique key, but here we check existence.
-- Note: existing packs might not match this exactly, so we only insert if the table is empty or specific packs missing.

INSERT INTO packs (title, price, features, highlight, display_order, description)
SELECT 'Bronze', '750€', ARRAY['Cerimónia (Igreja ou Civil)', 'Cocktail / Aperitivos', 'Deslocação até 50km'], false, 1, 'O essencial para uma cerimónia inesquecível.'
WHERE NOT EXISTS (SELECT 1 FROM packs WHERE title = 'Bronze');

INSERT INTO packs (title, price, features, highlight, display_order, description)
SELECT 'Prata', '1200€', ARRAY['Cocktail / Aperitivos', 'Copo d''água (2h Concerto)', 'DJ Set (Pós-concerto)', 'Deslocação até 50km'], true, 2, 'A escolha mais popular para animar a festa.'
WHERE NOT EXISTS (SELECT 1 FROM packs WHERE title = 'Prata');

INSERT INTO packs (title, price, features, highlight, display_order, description)
SELECT 'Ouro', '1700€', ARRAY['Cerimónia (Igreja ou Civil)', 'Cocktail / Aperitivos', 'Copo d''água (2h Concerto)', 'DJ Set (Pós-concerto)', 'Deslocação até 50km'], false, 3, 'A experiência completa do início ao fim.'
WHERE NOT EXISTS (SELECT 1 FROM packs WHERE title = 'Ouro');

COMMIT;
