-- Migration script to add multi-user support to existing Fuel Logbook database
-- Run this AFTER setting up Supabase authentication

-- Step 1: Create users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 2: Create cars table (multiple cars per user)
CREATE TABLE IF NOT EXISTS cars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER,
  registration_number TEXT,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, registration_number)
);

-- Step 3: Add user_id and car_id columns to fuel_entries
-- Check if columns don't exist before adding them
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'fuel_entries' AND column_name = 'user_id') THEN
    ALTER TABLE fuel_entries ADD COLUMN user_id UUID REFERENCES users(id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'fuel_entries' AND column_name = 'car_id') THEN
    ALTER TABLE fuel_entries ADD COLUMN car_id UUID REFERENCES cars(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Step 4: Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_cars_user_id ON cars(user_id);
CREATE INDEX IF NOT EXISTS idx_fuel_entries_user_id ON fuel_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_fuel_entries_car_id ON fuel_entries(car_id);
CREATE INDEX IF NOT EXISTS idx_fuel_entries_user_date ON fuel_entries(user_id, date DESC);

-- Step 5: Add triggers for updated_at on new tables
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_cars_updated_at ON cars;
CREATE TRIGGER update_cars_updated_at
  BEFORE UPDATE ON cars
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Step 6: Optional - Migrate existing data to a default user
-- UNCOMMENT THE FOLLOWING IF YOU HAVE EXISTING DATA AND WANT TO ASSIGN IT TO A USER
/*
-- First, you need to create a user in Supabase Auth, then get their UUID
-- Replace 'YOUR_USER_UUID_HERE' with the actual UUID from Supabase

-- Insert user record
INSERT INTO users (id, email, full_name)
VALUES ('YOUR_USER_UUID_HERE', 'your-email@example.com', 'Your Name')
ON CONFLICT (id) DO NOTHING;

-- Create a default car for the user
INSERT INTO cars (user_id, make, model, year, registration_number, is_default)
VALUES ('YOUR_USER_UUID_HERE', 'Default', 'Car', 2024, 'UNKNOWN', TRUE)
ON CONFLICT DO NOTHING
RETURNING id;

-- Update existing fuel entries to belong to this user and car
-- Replace 'YOUR_CAR_UUID_HERE' with the UUID returned from the previous INSERT
UPDATE fuel_entries
SET user_id = 'YOUR_USER_UUID_HERE',
    car_id = 'YOUR_CAR_UUID_HERE'
WHERE user_id IS NULL;
*/

-- Step 7: After migration, you can make user_id NOT NULL (optional, do this after data migration)
-- UNCOMMENT AFTER YOU'VE MIGRATED ALL EXISTING DATA
-- ALTER TABLE fuel_entries ALTER COLUMN user_id SET NOT NULL;
