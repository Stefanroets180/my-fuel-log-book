-- =====================================================
-- NEON FRESH DATABASE SCHEMA
-- =====================================================
-- This script creates a complete fresh database schema for Neon
-- Run this using the Neon SQL Editor or via psql
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- USERS TABLE (For future multi-user support)
-- =====================================================
-- Note: This table is prepared for Supabase auth integration
-- For now, you can use it without authentication
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- CARS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS cars (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER,
  registration_number TEXT NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_registration_per_user UNIQUE (user_id, registration_number)
);

-- =====================================================
-- FUEL ENTRIES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS fuel_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  car_id UUID REFERENCES cars(id) ON DELETE SET NULL,
  date DATE NOT NULL,
  odometer_reading DECIMAL(10, 2) NOT NULL,
  fuel_amount DECIMAL(10, 2) NOT NULL,
  fuel_cost DECIMAL(10, 2) NOT NULL,
  fuel_type TEXT DEFAULT 'Petrol',
  is_full_tank BOOLEAN DEFAULT TRUE,
  notes TEXT,
  receipt_image_url TEXT,
  work_distance DECIMAL(10, 2),
  is_locked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_cars_user_id ON cars(user_id);
CREATE INDEX IF NOT EXISTS idx_cars_is_default ON cars(user_id, is_default);
CREATE INDEX IF NOT EXISTS idx_fuel_entries_user_id ON fuel_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_fuel_entries_car_id ON fuel_entries(car_id);
CREATE INDEX IF NOT EXISTS idx_fuel_entries_date ON fuel_entries(date DESC);
CREATE INDEX IF NOT EXISTS idx_fuel_entries_user_date ON fuel_entries(user_id, date DESC);

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
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cars_updated_at
  BEFORE UPDATE ON cars
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fuel_entries_updated_at
  BEFORE UPDATE ON fuel_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to ensure only one default car per user
CREATE OR REPLACE FUNCTION ensure_single_default_car()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_default = TRUE THEN
    UPDATE cars
    SET is_default = FALSE
    WHERE user_id = NEW.user_id AND id != NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for default car enforcement
CREATE TRIGGER enforce_single_default_car
  BEFORE INSERT OR UPDATE ON cars
  FOR EACH ROW
  EXECUTE FUNCTION ensure_single_default_car();

-- =====================================================
-- OPTIONAL: INSERT A DEFAULT USER FOR TESTING
-- =====================================================
-- Uncomment the following lines if you want to create a test user
-- This is useful for testing without authentication

-- INSERT INTO users (email, full_name)
-- VALUES ('test@example.com', 'Test User')
-- ON CONFLICT (email) DO NOTHING;

-- =====================================================
-- SCHEMA CREATION COMPLETE
-- =====================================================
-- Your Neon database is now ready to use!
-- Next steps:
-- 1. Configure your DATABASE_URL environment variable
-- 2. Optionally create a test user (see above)
-- 3. Start using the app!
-- =====================================================
