-- Golf Charity Subscription Platform - Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES TABLE (extends Supabase auth.users)
-- ============================================
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- SUBSCRIPTIONS TABLE
-- ============================================
CREATE TABLE subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  plan_type TEXT NOT NULL DEFAULT 'monthly' CHECK (plan_type IN ('monthly', 'yearly')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'past_due')),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  charity_percentage INTEGER NOT NULL DEFAULT 10 CHECK (charity_percentage >= 10 AND charity_percentage <= 100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- SCORES TABLE
-- ============================================
CREATE TABLE scores (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  score_value INTEGER NOT NULL CHECK (score_value >= 1 AND score_value <= 45),
  score_date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for efficient score queries
CREATE INDEX idx_scores_user_date ON scores(user_id, score_date DESC);

-- ============================================
-- CHARITIES TABLE
-- ============================================
CREATE TABLE charities (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT,
  website TEXT,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- USER_CHARITIES TABLE (user-charity selection)
-- ============================================
CREATE TABLE user_charities (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  charity_id UUID REFERENCES charities(id) ON DELETE CASCADE NOT NULL,
  contribution_percentage INTEGER NOT NULL DEFAULT 10 CHECK (contribution_percentage >= 10),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, charity_id)
);

-- ============================================
-- DONATIONS TABLE
-- ============================================
CREATE TABLE donations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  charity_id UUID REFERENCES charities(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
  type TEXT NOT NULL DEFAULT 'subscription' CHECK (type IN ('subscription', 'independent')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- DRAWS TABLE
-- ============================================
CREATE TABLE draws (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  draw_date DATE NOT NULL,
  draw_type TEXT NOT NULL DEFAULT 'random' CHECK (draw_type IN ('random', 'weighted')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'simulated', 'published')),
  winning_numbers INTEGER[] NOT NULL DEFAULT '{}',
  prize_pool_5_match DECIMAL(10,2) NOT NULL DEFAULT 0,
  prize_pool_4_match DECIMAL(10,2) NOT NULL DEFAULT 0,
  prize_pool_3_match DECIMAL(10,2) NOT NULL DEFAULT 0,
  jackpot_rollover DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- DRAW_RESULTS TABLE
-- ============================================
CREATE TABLE draw_results (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  draw_id UUID REFERENCES draws(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  matched_numbers INTEGER[] NOT NULL DEFAULT '{}',
  match_count INTEGER NOT NULL DEFAULT 0,
  prize_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- WINNERS TABLE
-- ============================================
CREATE TABLE winners (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  draw_result_id UUID REFERENCES draw_results(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  match_type TEXT NOT NULL CHECK (match_type IN ('5_match', '4_match', '3_match')),
  prize_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  verification_status TEXT NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected', 'paid')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- WINNER_PROOFS TABLE
-- ============================================
CREATE TABLE winner_proofs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  winner_id UUID REFERENCES winners(id) ON DELETE CASCADE NOT NULL,
  proof_url TEXT NOT NULL,
  notes TEXT,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- PRIZE_POOL TABLE
-- ============================================
CREATE TABLE prize_pool (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  month DATE NOT NULL UNIQUE,
  total_pool DECIMAL(10,2) NOT NULL DEFAULT 0,
  five_match_pool DECIMAL(10,2) NOT NULL DEFAULT 0,
  four_match_pool DECIMAL(10,2) NOT NULL DEFAULT 0,
  three_match_pool DECIMAL(10,2) NOT NULL DEFAULT 0,
  rollover_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE charities ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_charities ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE draws ENABLE ROW LEVEL SECURITY;
ALTER TABLE draw_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE winners ENABLE ROW LEVEL SECURITY;
ALTER TABLE winner_proofs ENABLE ROW LEVEL SECURITY;
ALTER TABLE prize_pool ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read all, update own
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Subscriptions: users can view own
CREATE POLICY "Users can view own subscription" ON subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service role can manage subscriptions" ON subscriptions FOR ALL USING (true);

-- Scores: users can manage own
CREATE POLICY "Users can view own scores" ON scores FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own scores" ON scores FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own scores" ON scores FOR DELETE USING (auth.uid() = user_id);

-- Charities: public read
CREATE POLICY "Charities are viewable by everyone" ON charities FOR SELECT USING (true);
CREATE POLICY "Admins can manage charities" ON charities FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- User charities: users can manage own
CREATE POLICY "Users can view own charities" ON user_charities FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own charities" ON user_charities FOR ALL USING (auth.uid() = user_id);

-- Donations: users can view own
CREATE POLICY "Users can view own donations" ON donations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own donations" ON donations FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Draws: public read when published
CREATE POLICY "Published draws are viewable" ON draws FOR SELECT USING (status = 'published');
CREATE POLICY "Admins can manage draws" ON draws FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- Draw results: users can view own
CREATE POLICY "Users can view own draw results" ON draw_results FOR SELECT USING (auth.uid() = user_id);

-- Winners: users can view own
CREATE POLICY "Users can view own wins" ON winners FOR SELECT USING (auth.uid() = user_id);

-- Winner proofs: users can manage own
CREATE POLICY "Users can view own proofs" ON winner_proofs FOR SELECT USING (
  EXISTS (SELECT 1 FROM winners WHERE winners.id = winner_proofs.winner_id AND winners.user_id = auth.uid())
);
CREATE POLICY "Users can insert own proofs" ON winner_proofs FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM winners WHERE winners.id = winner_proofs.winner_id AND winners.user_id = auth.uid())
);

-- Prize pool: public read
CREATE POLICY "Prize pool is viewable" ON prize_pool FOR SELECT USING (true);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_charities_updated_at BEFORE UPDATE ON charities FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_draws_updated_at BEFORE UPDATE ON draws FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_winners_updated_at BEFORE UPDATE ON winners FOR EACH ROW EXECUTE FUNCTION update_updated_at();
