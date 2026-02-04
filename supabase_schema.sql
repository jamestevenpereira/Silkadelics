-- WoodPlan Events - Supabase Schema (Idempotent)

-- 1. Create Tables IF NOT EXISTS
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  date DATE NOT NULL,
  event_type TEXT NOT NULL,
  pack TEXT NOT NULL,
  extras TEXT,
  message TEXT,
  status TEXT DEFAULT 'pending'
);

CREATE TABLE IF NOT EXISTS packs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price TEXT NOT NULL,
  features TEXT[] NOT NULL,
  is_popular BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS gallery (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  url TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('image', 'video')),
  title TEXT
);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS team (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  img TEXT,
  instagram TEXT,
  category TEXT NOT NULL CHECK (category IN ('member', 'partner')),
  display_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS repertoire (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  category TEXT NOT NULL,
  display_order INTEGER DEFAULT 0
);

-- 2. Insert default settings
INSERT INTO settings (key, value) 
VALUES ('promo_video_url', 'https://www.youtube.com/embed/dQw4w9WgXcQ') 
ON CONFLICT (key) DO NOTHING;

-- 3. Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE packs ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE team ENABLE ROW LEVEL SECURITY;
ALTER TABLE repertoire ENABLE ROW LEVEL SECURITY;

-- 4. Policies (Drop if exists then create)
-- ... (existing policies)

-- Team
DROP POLICY IF EXISTS "Allow public read team" ON team;
CREATE POLICY "Allow public read team" ON team FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow authenticated manage team" ON team;
CREATE POLICY "Allow authenticated manage team" ON team FOR ALL TO authenticated USING (true);

-- Repertoire
DROP POLICY IF EXISTS "Allow public read repertoire" ON repertoire;
CREATE POLICY "Allow public read repertoire" ON repertoire FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow authenticated manage repertoire" ON repertoire;
CREATE POLICY "Allow authenticated manage repertoire" ON repertoire FOR ALL TO authenticated USING (true);

-- Storage Buckets (Manual setup in Supabase UI usually, but policies here)
-- Bucket: team-photos
-- Bucket: gallery

-- Bookings
DROP POLICY IF EXISTS "Allow public inserts" ON bookings;
CREATE POLICY "Allow public inserts" ON bookings FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated read" ON bookings;
CREATE POLICY "Allow authenticated read" ON bookings FOR SELECT TO authenticated USING (true);

-- Packs
DROP POLICY IF EXISTS "Allow public read" ON packs; -- Old policy name
DROP POLICY IF EXISTS "Allow public read packs" ON packs;
CREATE POLICY "Allow public read packs" ON packs FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow authenticated manage packs" ON packs;
CREATE POLICY "Allow authenticated manage packs" ON packs FOR ALL TO authenticated USING (true);

-- Gallery
DROP POLICY IF EXISTS "Allow public read gallery" ON gallery;
CREATE POLICY "Allow public read gallery" ON gallery FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow authenticated manage gallery" ON gallery;
CREATE POLICY "Allow authenticated manage gallery" ON gallery FOR ALL TO authenticated USING (true);

-- Settings
DROP POLICY IF EXISTS "Allow public read settings" ON settings;
CREATE POLICY "Allow public read settings" ON settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow authenticated manage settings" ON settings;
CREATE POLICY "Allow authenticated manage settings" ON settings FOR ALL TO authenticated USING (true);
