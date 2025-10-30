-- Add work_distance_km and is_locked columns to fuel_entries table
-- This migration adds optional work distance tracking and entry locking functionality

ALTER TABLE fuel_entries 
ADD COLUMN IF NOT EXISTS work_distance_km INTEGER,
ADD COLUMN IF NOT EXISTS is_locked BOOLEAN DEFAULT FALSE;

-- Add comment to explain the columns
COMMENT ON COLUMN fuel_entries.work_distance_km IS 'Optional: Distance traveled for work purposes (subset of total distance)';
COMMENT ON COLUMN fuel_entries.is_locked IS 'Prevents deletion when true - use to protect verified entries';

-- Create index for locked entries for faster queries
CREATE INDEX IF NOT EXISTS idx_fuel_entries_locked ON fuel_entries(is_locked);
