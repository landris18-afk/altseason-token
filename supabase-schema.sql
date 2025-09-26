-- Supabase adatbázis séma a játékhoz
-- Futtasd le ezt a Supabase SQL Editor-ben

-- Felhasználók tábla (integrálva Clerk-rel)
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clerk_id TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Játék állapotok tábla
CREATE TABLE IF NOT EXISTS game_states (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  market_cap DECIMAL(15,2) DEFAULT 0,
  click_power DECIMAL(10,2) DEFAULT 0,
  passive_income DECIMAL(10,2) DEFAULT 0,
  level INTEGER DEFAULT 1,
  level_index INTEGER DEFAULT 0,
  total_clicks INTEGER DEFAULT 0,
  total_earned DECIMAL(15,2) DEFAULT 0,
  upgrades JSONB DEFAULT '{}',
  achievements JSONB DEFAULT '[]',
  settings JSONB DEFAULT '{}',
  platform TEXT DEFAULT 'desktop',
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);


-- Játék beállítások tábla
CREATE TABLE IF NOT EXISTS game_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  display_name TEXT,
  use_real_name BOOLEAN DEFAULT true,
  enable_leaderboard BOOLEAN DEFAULT true,
  enable_sounds BOOLEAN DEFAULT true,
  enable_animations BOOLEAN DEFAULT true,
  theme TEXT DEFAULT 'light',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Indexek a jobb teljesítményért
CREATE INDEX IF NOT EXISTS idx_game_states_user_id ON game_states(user_id);
CREATE INDEX IF NOT EXISTS idx_game_states_market_cap ON game_states(market_cap DESC);
CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_id);

-- RLS (Row Level Security) beállítása
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_settings ENABLE ROW LEVEL SECURITY;

-- RLS szabályok - felhasználók csak a saját adataikat láthatják/módosíthatják
DROP POLICY IF EXISTS "Users can view own data" ON users;
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (clerk_id = auth.jwt() ->> 'sub');

DROP POLICY IF EXISTS "Users can update own data" ON users;
CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (clerk_id = auth.jwt() ->> 'sub');

DROP POLICY IF EXISTS "Users can insert own data" ON users;
CREATE POLICY "Users can insert own data" ON users
  FOR INSERT WITH CHECK (clerk_id = auth.jwt() ->> 'sub');

-- Game states RLS
DROP POLICY IF EXISTS "Users can view own game states" ON game_states;
CREATE POLICY "Users can view own game states" ON game_states
  FOR SELECT USING (user_id IN (
    SELECT id FROM users WHERE clerk_id = auth.jwt() ->> 'sub'
  ));

DROP POLICY IF EXISTS "Users can update own game states" ON game_states;
CREATE POLICY "Users can update own game states" ON game_states
  FOR UPDATE USING (user_id IN (
    SELECT id FROM users WHERE clerk_id = auth.jwt() ->> 'sub'
  ));

DROP POLICY IF EXISTS "Users can insert own game states" ON game_states;
CREATE POLICY "Users can insert own game states" ON game_states
  FOR INSERT WITH CHECK (user_id IN (
    SELECT id FROM users WHERE clerk_id = auth.jwt() ->> 'sub'
  ));

DROP POLICY IF EXISTS "Users can delete own game states" ON game_states;
CREATE POLICY "Users can delete own game states" ON game_states
  FOR DELETE USING (user_id IN (
    SELECT id FROM users WHERE clerk_id = auth.jwt() ->> 'sub'
  ));


-- Game settings RLS
DROP POLICY IF EXISTS "Users can view own settings" ON game_settings;
CREATE POLICY "Users can view own settings" ON game_settings
  FOR SELECT USING (user_id IN (
    SELECT id FROM users WHERE clerk_id = auth.jwt() ->> 'sub'
  ));

DROP POLICY IF EXISTS "Users can update own settings" ON game_settings;
CREATE POLICY "Users can update own settings" ON game_settings
  FOR UPDATE USING (user_id IN (
    SELECT id FROM users WHERE clerk_id = auth.jwt() ->> 'sub'
  ));

DROP POLICY IF EXISTS "Users can insert own settings" ON game_settings;
CREATE POLICY "Users can insert own settings" ON game_settings
  FOR INSERT WITH CHECK (user_id IN (
    SELECT id FROM users WHERE clerk_id = auth.jwt() ->> 'sub'
  ));

-- Automatikus updated_at frissítés trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_game_states_updated_at ON game_states;
CREATE TRIGGER update_game_states_updated_at BEFORE UPDATE ON game_states
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


DROP TRIGGER IF EXISTS update_game_settings_updated_at ON game_settings;
CREATE TRIGGER update_game_settings_updated_at BEFORE UPDATE ON game_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
