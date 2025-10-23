-- Create fuel_entries table for tracking fuel consumption
CREATE TABLE IF NOT EXISTS fuel_entries (
  id SERIAL PRIMARY KEY,
  date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  odometer_reading INTEGER NOT NULL,
  liters DECIMAL(10, 2) NOT NULL,
  price_per_liter DECIMAL(10, 2) NOT NULL,
  total_cost DECIMAL(10, 2) NOT NULL,
  petrol_station VARCHAR(255),
  receipt_image_url TEXT,
  is_work_travel BOOLEAN DEFAULT FALSE,
  km_per_liter DECIMAL(10, 2),
  distance_traveled INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_fuel_entries_date ON fuel_entries(date DESC);
CREATE INDEX IF NOT EXISTS idx_fuel_entries_work_travel ON fuel_entries(is_work_travel);

-- Add a trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_fuel_entries_updated_at BEFORE UPDATE
  ON fuel_entries FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
