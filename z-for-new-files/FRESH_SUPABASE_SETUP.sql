-- =====================================================
-- FUEL LOGBOOK - FRESH SUPABASE DATABASE SETUP
-- =====================================================
-- This is the ONLY SQL script you need to run
-- Run this in Supabase SQL Editor for a brand new setup
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- USERS TABLE
-- =====================================================
-- Extends Supabase auth.users with profile information
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- CARS TABLE
-- =====================================================
-- Stores user vehicles (multiple cars per user)
CREATE TABLE IF NOT EXISTS public.cars (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER,
  registration_number TEXT,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_registration_per_user UNIQUE (user_id, registration_number)
);

-- =====================================================
-- FUEL ENTRIES TABLE
-- =====================================================
-- Stores all fuel log entries
CREATE TABLE IF NOT EXISTS public.fuel_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  car_id UUID REFERENCES public.cars(id) ON DELETE SET NULL,
  date DATE NOT NULL,
  odometer_reading DECIMAL(10, 2) NOT NULL,
  liters DECIMAL(10, 2) NOT NULL,
  price_per_liter DECIMAL(10, 2) NOT NULL,
  total_cost DECIMAL(10, 2) NOT NULL,
  petrol_station TEXT,
  receipt_image_url TEXT,
  is_work_travel BOOLEAN DEFAULT FALSE,
  km_per_liter DECIMAL(10, 2),
  distance_traveled DECIMAL(10, 2),
  work_distance_km DECIMAL(10, 2),
  is_locked BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_cars_user_id ON public.cars(user_id);
CREATE INDEX IF NOT EXISTS idx_cars_is_default ON public.cars(user_id, is_default);
CREATE INDEX IF NOT EXISTS idx_fuel_entries_user_id ON public.fuel_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_fuel_entries_car_id ON public.fuel_entries(car_id);
CREATE INDEX IF NOT EXISTS idx_fuel_entries_date ON public.fuel_entries(date DESC);
CREATE INDEX IF NOT EXISTS idx_fuel_entries_user_date ON public.fuel_entries(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_fuel_entries_work_travel ON public.fuel_entries(is_work_travel);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fuel_entries ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Cars table policies
CREATE POLICY "Users can view own cars"
  ON public.cars FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cars"
  ON public.cars FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cars"
  ON public.cars FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own cars"
  ON public.cars FOR DELETE
  USING (auth.uid() = user_id);

-- Fuel entries table policies
CREATE POLICY "Users can view own fuel entries"
  ON public.fuel_entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own fuel entries"
  ON public.fuel_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own fuel entries"
  ON public.fuel_entries FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own fuel entries"
  ON public.fuel_entries FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cars_updated_at
  BEFORE UPDATE ON public.cars
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fuel_entries_updated_at
  BEFORE UPDATE ON public.fuel_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to ensure only one default car per user
CREATE OR REPLACE FUNCTION ensure_single_default_car()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_default = TRUE THEN
    UPDATE public.cars
    SET is_default = FALSE
    WHERE user_id = NEW.user_id AND id != NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for default car enforcement
CREATE TRIGGER enforce_single_default_car
  BEFORE INSERT OR UPDATE ON public.cars
  FOR EACH ROW
  EXECUTE FUNCTION ensure_single_default_car();

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- =====================================================
-- SETUP COMPLETE!
-- =====================================================
-- Your database is ready. Next steps:
-- 1. Enable Email authentication in Supabase Dashboard
-- 2. Add your environment variables to .env.local
-- 3. Run: npm install
-- 4. Run: npm run dev
-- =====================================================
