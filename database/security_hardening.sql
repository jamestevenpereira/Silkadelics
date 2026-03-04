-- SEO & Security Hardening Script

-- 1. Create a View for Public Gallery (Exclude internal IDs if necessary, though serial is fine here)
CREATE OR REPLACE VIEW public_gallery AS
SELECT id, url, type, title, created_at
FROM gallery
WHERE type IN ('image', 'video');

-- 2. Create a View for Public Team
CREATE OR REPLACE VIEW public_team AS
SELECT id, name, role, img, instagram, category, display_order
FROM team;

-- 3. Update RLS for Testimonials (Ensure public can only READ)
-- If testimonials table doesn't exist yet, this will error safely or create it
CREATE TABLE IF NOT EXISTS testimonials (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  role TEXT,
  content TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  img TEXT
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Testimonials" ON testimonials;
CREATE POLICY "Public Read Testimonials" ON testimonials FOR SELECT USING (true);

-- 4. Rate Limiting Logic (Hypothetical for Postgres, usually handled at API level)
-- But we can add a check for booking dates to prevent duplicate spam in the same minute
-- This is a more advanced trigger-based approach if needed.

-- 5. Revoke direct access to sensitive tables if using Views (Optional but recommended for strict SEO/Security)
-- GRANT SELECT ON public_gallery TO anon;
-- GRANT SELECT ON public_team TO anon;
