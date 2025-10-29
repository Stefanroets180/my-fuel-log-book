-- Initial database schema for Fuel Logbook App
-- This creates the basic fuel_entries table (for single-user mode)

CREATE TABLE IF NOT EXISTS fuel_entries (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  odometer_reading INTEGER NOT NULL,
  liters DECIMAL(10, 2) NOT NULL,
  price_per_liter DECIMAL(10, 2) NOT NULL,
  total_cost DECIMAL(10, 2) NOT NULL,
  petrol_station TEXT,
  receipt_image_url TEXT,
  is_work_travel BOOLEAN DEFAULT FALSE,
  km_per_liter DECIMAL(10, 2),
  distance_traveled INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster date-based queries
CREATE INDEX IF NOT EXISTS idx_fuel_entries_date ON fuel_entries(date DESC);

-- Create index for odometer readings
CREATE INDEX IF NOT EXISTS idx_fuel_entries_odometer ON fuel_entries(odometer_reading);

-- Create a function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger for updated_at
DROP TRIGGER IF EXISTS update_fuel_entries_updated_at ON fuel_entries;
CREATE TRIGGER update_fuel_entries_updated_at
  BEFORE UPDATE ON fuel_entries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
