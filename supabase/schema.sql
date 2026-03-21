-- ================================================================
-- HomePath Database Schema
-- Run this in your Supabase SQL Editor
-- ================================================================

-- PROFILES (extends auth.users — one row per user)
CREATE TABLE IF NOT EXISTS profiles (
  id         UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name  TEXT,
  role       TEXT NOT NULL CHECK (role IN ('buyer', 'realtor')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- BUYERS (one row per buyer user)
CREATE TABLE IF NOT EXISTS buyers (
  id                  UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
  location            TEXT,
  budget              TEXT,
  timeline            TEXT,
  experience          TEXT,
  com_style           TEXT,
  journey_step        INTEGER DEFAULT 1,
  onboarding_complete BOOLEAN DEFAULT FALSE,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- REALTORS (one row per realtor user)
CREATE TABLE IF NOT EXISTS realtors (
  id               UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
  bio              TEXT,
  location         TEXT,
  specialties      TEXT[],
  license_number   TEXT,
  years_experience INTEGER,
  avg_rating       DECIMAL(3,2) DEFAULT 0,
  total_reviews    INTEGER DEFAULT 0,
  response_time    TEXT DEFAULT '< 2 hrs',
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- MATCHES (buyer ↔ realtor pairing)
CREATE TABLE IF NOT EXISTS matches (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  buyer_id    UUID REFERENCES buyers(id) ON DELETE CASCADE NOT NULL,
  realtor_id  UUID REFERENCES realtors(id) ON DELETE CASCADE NOT NULL,
  status      TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'cancelled')),
  match_score INTEGER,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(buyer_id, realtor_id)
);

-- MESSAGES (in-app chat per match)
CREATE TABLE IF NOT EXISTS messages (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id   UUID REFERENCES matches(id) ON DELETE CASCADE NOT NULL,
  sender_id  UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content    TEXT NOT NULL,
  read       BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Row-Level Security ───────────────────────────────────────────
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE buyers   ENABLE ROW LEVEL SECURITY;
ALTER TABLE realtors ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches  ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- profiles
CREATE POLICY "profiles_select_own"   ON profiles FOR SELECT  USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own"   ON profiles FOR INSERT  WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own"   ON profiles FOR UPDATE  USING (auth.uid() = id);

-- buyers
CREATE POLICY "buyers_select_own"     ON buyers   FOR SELECT  USING (auth.uid() = id);
CREATE POLICY "buyers_insert_own"     ON buyers   FOR INSERT  WITH CHECK (auth.uid() = id);
CREATE POLICY "buyers_update_own"     ON buyers   FOR UPDATE  USING (auth.uid() = id);

-- realtors (public read, own write)
CREATE POLICY "realtors_select_all"   ON realtors FOR SELECT  USING (TRUE);
CREATE POLICY "realtors_insert_own"   ON realtors FOR INSERT  WITH CHECK (auth.uid() = id);
CREATE POLICY "realtors_update_own"   ON realtors FOR UPDATE  USING (auth.uid() = id);

-- matches
CREATE POLICY "matches_select_own"    ON matches  FOR SELECT  USING (auth.uid() = buyer_id OR auth.uid() = realtor_id);
CREATE POLICY "matches_insert_buyer"  ON matches  FOR INSERT  WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "matches_update_own"    ON matches  FOR UPDATE  USING (auth.uid() = buyer_id OR auth.uid() = realtor_id);

-- messages
CREATE POLICY "messages_select_own"   ON messages FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM matches
    WHERE matches.id = match_id
      AND (matches.buyer_id = auth.uid() OR matches.realtor_id = auth.uid())
  ));
CREATE POLICY "messages_insert_own"   ON messages FOR INSERT
  WITH CHECK (
    sender_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM matches
      WHERE matches.id = match_id
        AND (matches.buyer_id = auth.uid() OR matches.realtor_id = auth.uid())
    )
  );

-- ── Auto-create profile on signup ───────────────────────────────
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'full_name',
    COALESCE(NEW.raw_user_meta_data ->> 'role', 'buyer')
  );
  -- If role is buyer, also create buyers row
  IF COALESCE(NEW.raw_user_meta_data ->> 'role', 'buyer') = 'buyer' THEN
    INSERT INTO buyers (id) VALUES (NEW.id);
  END IF;
  -- If role is realtor, also create realtors row
  IF NEW.raw_user_meta_data ->> 'role' = 'realtor' THEN
    INSERT INTO realtors (id) VALUES (NEW.id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ── Updated_at trigger helper ────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE OR REPLACE TRIGGER buyers_updated_at   BEFORE UPDATE ON buyers   FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE OR REPLACE TRIGGER realtors_updated_at BEFORE UPDATE ON realtors FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE OR REPLACE TRIGGER matches_updated_at  BEFORE UPDATE ON matches  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ================================================================
-- Enable Realtime for the messages table
-- Run this in Supabase SQL Editor (or via Dashboard > Database > Replication)
-- ================================================================
-- ALTER PUBLICATION supabase_realtime ADD TABLE messages;
-- Note: you can also enable this via Dashboard → Database → Replication
-- and toggling "messages" to ON.
