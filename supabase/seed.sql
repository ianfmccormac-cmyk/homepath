-- ================================================================
-- HomePath Demo Seed Data
-- Inserts 3 demo realtors directly into profiles + realtors tables
-- Run AFTER schema.sql in your Supabase SQL Editor
-- These use deterministic UUIDs so re-running is idempotent
-- ================================================================

-- Demo realtor UUIDs (stable, not real auth users)
DO $$
DECLARE
  paloma_id UUID := '00000000-0000-0000-0000-000000000001';
  marcus_id UUID := '00000000-0000-0000-0000-000000000002';
  priya_id  UUID := '00000000-0000-0000-0000-000000000003';
BEGIN

  -- ── Paloma Aguilar ──────────────────────────────────────────────
  INSERT INTO profiles (id, full_name, role, avatar_url)
  VALUES (
    paloma_id,
    'Paloma Aguilar',
    'realtor',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80'
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name  = EXCLUDED.full_name,
    role       = EXCLUDED.role,
    avatar_url = EXCLUDED.avatar_url;

  INSERT INTO realtors (id, bio, location, specialties, years_experience, avg_rating, total_reviews, response_time)
  VALUES (
    paloma_id,
    'Austin native with 9 years helping first-time buyers navigate the Texas market. Known for patience, transparency, and zero jargon.',
    'Austin, TX',
    ARRAY['First-time buyers', 'Starter homes', 'Condos'],
    9,
    4.9,
    87,
    '< 1 hr'
  )
  ON CONFLICT (id) DO UPDATE SET
    bio           = EXCLUDED.bio,
    location      = EXCLUDED.location,
    specialties   = EXCLUDED.specialties,
    avg_rating    = EXCLUDED.avg_rating,
    total_reviews = EXCLUDED.total_reviews,
    response_time = EXCLUDED.response_time;

  -- ── Marcus Rivera ───────────────────────────────────────────────
  INSERT INTO profiles (id, full_name, role, avatar_url)
  VALUES (
    marcus_id,
    'Marcus Rivera',
    'realtor',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name  = EXCLUDED.full_name,
    role       = EXCLUDED.role,
    avatar_url = EXCLUDED.avatar_url;

  INSERT INTO realtors (id, bio, location, specialties, years_experience, avg_rating, total_reviews, response_time)
  VALUES (
    marcus_id,
    'Denver-based specialist in investment properties and corporate relocation. Closed 44 homes last year across CO and TX.',
    'Denver, CO',
    ARRAY['Investment & relocation', 'Multi-family', 'Corporate buyers'],
    12,
    4.8,
    61,
    '< 2 hrs'
  )
  ON CONFLICT (id) DO UPDATE SET
    bio           = EXCLUDED.bio,
    location      = EXCLUDED.location,
    specialties   = EXCLUDED.specialties,
    avg_rating    = EXCLUDED.avg_rating,
    total_reviews = EXCLUDED.total_reviews,
    response_time = EXCLUDED.response_time;

  -- ── Priya Kapoor ────────────────────────────────────────────────
  INSERT INTO profiles (id, full_name, role, avatar_url)
  VALUES (
    priya_id,
    'Priya Kapoor',
    'realtor',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name  = EXCLUDED.full_name,
    role       = EXCLUDED.role,
    avatar_url = EXCLUDED.avatar_url;

  INSERT INTO realtors (id, bio, location, specialties, years_experience, avg_rating, total_reviews, response_time)
  VALUES (
    priya_id,
    'Miami luxury specialist with 15 years closing high-end beachfront and condo deals. Perfect 5.0 rating across 103 reviews.',
    'Miami, FL',
    ARRAY['Luxury & condos', 'Waterfront', 'High-rise condos'],
    15,
    5.0,
    103,
    '< 30 min'
  )
  ON CONFLICT (id) DO UPDATE SET
    bio           = EXCLUDED.bio,
    location      = EXCLUDED.location,
    specialties   = EXCLUDED.specialties,
    avg_rating    = EXCLUDED.avg_rating,
    total_reviews = EXCLUDED.total_reviews,
    response_time = EXCLUDED.response_time;

END $$;
