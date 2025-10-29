# Database Migration Guide - Multi-User Support

This guide explains how to migrate your existing Fuel Logbook database to support multiple users with Supabase authentication.

## Overview

The migration adds:
- **Users table**: Stores user profile information (linked to Supabase Auth)
- **Cars table**: Allows each user to have multiple cars
- **Updated fuel_entries table**: Links entries to specific users and cars

## Migration Paths

Choose the path that matches your situation:

### Path A: Fresh Installation (No Existing Data)

If you're starting fresh with no existing fuel entries:

1. Follow `SUPABASE_AUTHENTICATION_SETUP.md` to set up Supabase
2. Run the Supabase schema script in your Supabase SQL Editor:
   - Copy contents of `scripts/supabase-schema.sql`
   - Paste into Supabase SQL Editor
   - Click "Run"
3. Done! Your database is ready for multi-user support

### Path B: Existing Data in Neon Database

If you have existing fuel entries in a Neon database:

#### Step 1: Backup Your Data

**IMPORTANT**: Always backup before migration!

\`\`\`sql
-- In Neon SQL Editor, export your data
COPY (SELECT * FROM fuel_entries) TO STDOUT WITH CSV HEADER;
\`\`\`

Save this output to a file called `fuel_entries_backup.csv`

#### Step 2: Set Up Supabase

1. Follow `SUPABASE_AUTHENTICATION_SETUP.md` to create your Supabase project
2. Run the Supabase schema script (from `scripts/supabase-schema.sql`)
3. Create your first user account by signing up in your app

#### Step 3: Get Your User UUID

After creating your account:

1. Go to Supabase Dashboard → Authentication → Users
2. Click on your user
3. Copy the UUID (looks like: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`)

#### Step 4: Migrate Existing Data

Option A: Using Supabase SQL Editor

1. Go to Supabase Dashboard → SQL Editor
2. Create a new query
3. Run the following (replace `YOUR_USER_UUID` with your actual UUID):

\`\`\`sql
-- Insert your user record (if not already created by trigger)
INSERT INTO public.users (id, email)
VALUES ('YOUR_USER_UUID', 'your-email@example.com')
ON CONFLICT (id) DO NOTHING;

-- Create a default car for your existing entries
INSERT INTO public.cars (user_id, make, model, year, registration_number, is_default)
VALUES ('YOUR_USER_UUID', 'My Car', 'Default', 2024, 'MIGRATED', TRUE)
RETURNING id;
-- Copy the returned UUID (this is your car_id)

-- Update existing fuel entries
-- Replace YOUR_CAR_UUID with the UUID from the previous step
UPDATE public.fuel_entries
SET user_id = 'YOUR_USER_UUID',
    car_id = 'YOUR_CAR_UUID'
WHERE user_id IS NULL;
\`\`\`

Option B: Using Migration Script

1. Edit `scripts/02-migrate-to-multi-user.sql`
2. Uncomment the migration section at the bottom
3. Replace the placeholder UUIDs with your actual values
4. Run the script in Supabase SQL Editor

#### Step 5: Verify Migration

Check that your data was migrated:

\`\`\`sql
-- Check users
SELECT * FROM public.users;

-- Check cars
SELECT * FROM public.cars;

-- Check fuel entries are linked
SELECT 
  fe.id,
  fe.date,
  fe.odometer_reading,
  u.email as user_email,
  c.make || ' ' || c.model as car
FROM public.fuel_entries fe
LEFT JOIN public.users u ON fe.user_id = u.id
LEFT JOIN public.cars c ON fe.car_id = c.id
ORDER BY fe.date DESC
LIMIT 10;
\`\`\`

All entries should show your email and car information.

#### Step 6: Make user_id Required (Optional)

After confirming all data is migrated:

\`\`\`sql
-- Make user_id required for all future entries
ALTER TABLE public.fuel_entries ALTER COLUMN user_id SET NOT NULL;
\`\`\`

## Database Schema Reference

### Users Table

\`\`\`sql
CREATE TABLE users (
  id UUID PRIMARY KEY,              -- Links to Supabase auth.users
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
\`\`\`

### Cars Table

\`\`\`sql
CREATE TABLE cars (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  make TEXT NOT NULL,               -- e.g., "Toyota"
  model TEXT NOT NULL,              -- e.g., "Camry"
  year INTEGER,                     -- e.g., 2020
  registration_number TEXT,         -- e.g., "ABC-123"
  is_default BOOLEAN DEFAULT FALSE, -- Default car for quick entry
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, registration_number)
);
\`\`\`

### Updated Fuel Entries Table

\`\`\`sql
ALTER TABLE fuel_entries ADD COLUMN user_id UUID REFERENCES users(id);
ALTER TABLE fuel_entries ADD COLUMN car_id UUID REFERENCES cars(id);
\`\`\`

## Row Level Security (RLS)

The Supabase schema automatically sets up RLS policies to ensure:

- Users can only see their own data
- Users can only create/update/delete their own entries
- Users cannot access other users' fuel entries or cars

### RLS Policies Created

**Users Table:**
- Users can view their own profile
- Users can update their own profile

**Cars Table:**
- Users can view only their own cars
- Users can create/update/delete only their own cars

**Fuel Entries Table:**
- Users can view only their own fuel entries
- Users can create entries only for their own cars
- Users can update/delete only their own entries

## Testing Multi-User Isolation

To verify that users are properly isolated:

1. Create two test accounts (User A and User B)
2. Log in as User A and create some fuel entries
3. Log out and log in as User B
4. Verify that User B cannot see User A's entries
5. Create entries as User B
6. Log back in as User A and verify you only see your own entries

## Troubleshooting

### Issue: "user_id cannot be null" error

**Cause**: Trying to create entries without authentication

**Solution**: 
1. Ensure you're logged in
2. Check that middleware is properly configured
3. Verify Supabase environment variables are set

### Issue: Existing entries disappeared after migration

**Cause**: Entries weren't migrated to a user

**Solution**:
1. Check if entries exist: `SELECT COUNT(*) FROM fuel_entries WHERE user_id IS NULL`
2. If yes, run the migration script to assign them to your user
3. If no, restore from backup

### Issue: Can see other users' data

**Cause**: RLS policies not enabled or not working

**Solution**:
1. Verify RLS is enabled: Check Supabase Dashboard → Database → Tables
2. Verify policies exist: Check Authentication → Policies
3. Re-run the Supabase schema script if policies are missing

### Issue: Cannot create new entries

**Cause**: Missing car_id or user_id

**Solution**:
1. Ensure you have at least one car created
2. Check that the API is passing user_id from the session
3. Verify the car belongs to the current user

## Rolling Back

If you need to roll back the migration:

### Remove Multi-User Columns

\`\`\`sql
-- Remove foreign key constraints
ALTER TABLE fuel_entries DROP COLUMN IF EXISTS car_id;
ALTER TABLE fuel_entries DROP COLUMN IF EXISTS user_id;

-- Drop new tables
DROP TABLE IF EXISTS cars CASCADE;
DROP TABLE IF EXISTS users CASCADE;
\`\`\`

### Restore from Backup

If you have a backup:

\`\`\`sql
-- Clear current data
TRUNCATE fuel_entries;

-- Import from CSV backup
COPY fuel_entries FROM '/path/to/fuel_entries_backup.csv' WITH CSV HEADER;
\`\`\`

## Next Steps

After successful migration:

1. Update your API routes to use user_id filtering (see next task)
2. Add car management UI
3. Test the multi-user functionality
4. Deploy to production

## Support

If you encounter issues during migration:
1. Check your backup is safe
2. Review the error messages in Supabase logs
3. Verify all UUIDs are correct
4. Test queries manually in SQL Editor before running in production
