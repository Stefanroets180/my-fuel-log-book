# Migrating from Neon to Supabase

This guide explains how to migrate your Fuel Logbook app from Neon database to Supabase (which includes both database and authentication).

## Why Migrate to Supabase?

- **Built-in Authentication**: No need for separate auth service
- **Row Level Security**: Automatic data isolation between users
- **Real-time subscriptions**: Optional real-time updates
- **Integrated solution**: Database + Auth + Storage in one platform

## Migration Steps

### Step 1: Export Data from Neon

1. Go to your Neon Console (https://console.neon.tech)
2. Select your project
3. Go to SQL Editor
4. Run this query to export your data:

\`\`\`sql
-- Export fuel entries
COPY (SELECT * FROM fuel_entries ORDER BY date) TO STDOUT WITH CSV HEADER;
\`\`\`

5. Save the output to `fuel_entries_export.csv`

### Step 2: Set Up Supabase Project

1. Follow the complete guide in `SUPABASE_AUTHENTICATION_SETUP.md`
2. This will:
   - Create your Supabase project
   - Set up authentication
   - Create the database schema with multi-user support

### Step 3: Import Data to Supabase

1. Sign up for your first account in the app
2. Get your user UUID from Supabase Dashboard → Authentication → Users
3. In Supabase SQL Editor, create a default car:

\`\`\`sql
-- Replace YOUR_USER_UUID with your actual UUID
INSERT INTO public.cars (user_id, make, model, year, registration_number, is_default)
VALUES ('YOUR_USER_UUID', 'My Car', 'Imported', 2024, 'MIGRATED', TRUE)
RETURNING id;
-- Save the returned car UUID
\`\`\`

4. Import your fuel entries:

\`\`\`sql
-- First, create a temporary table to import the CSV
CREATE TEMP TABLE temp_fuel_entries (
  id INTEGER,
  date DATE,
  odometer_reading INTEGER,
  liters DECIMAL(10, 2),
  price_per_liter DECIMAL(10, 2),
  total_cost DECIMAL(10, 2),
  petrol_station TEXT,
  receipt_image_url TEXT,
  is_work_travel BOOLEAN,
  km_per_liter DECIMAL(10, 2),
  distance_traveled INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Import from CSV (you'll need to use Supabase's import feature or psql)
-- In Supabase Dashboard: Database → Tables → Import CSV

-- After import, copy to main table with user_id and car_id
INSERT INTO public.fuel_entries (
  date, odometer_reading, liters, price_per_liter, total_cost,
  petrol_station, receipt_image_url, is_work_travel,
  km_per_liter, distance_traveled, notes,
  user_id, car_id, created_at, updated_at
)
SELECT 
  date, odometer_reading, liters, price_per_liter, total_cost,
  petrol_station, receipt_image_url, is_work_travel,
  km_per_liter, distance_traveled, notes,
  'YOUR_USER_UUID'::UUID,  -- Replace with your UUID
  'YOUR_CAR_UUID'::UUID,   -- Replace with your car UUID
  created_at, updated_at
FROM temp_fuel_entries
ORDER BY date;
\`\`\`

### Step 4: Update Environment Variables

1. In Vercel Dashboard, go to your project settings
2. Update environment variables:

**Remove:**
- `NEON_DATABASE_URL`

**Add:**
- `NEXT_PUBLIC_SUPABASE_URL` (from Supabase Dashboard)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (from Supabase Dashboard)
- `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` = `http://localhost:3000/auth/callback`

3. Redeploy your app

### Step 5: Update Code

1. Install Supabase packages:
\`\`\`bash
npm install @supabase/supabase-js @supabase/ssr
\`\`\`

2. Uncomment all Supabase authentication code (see `SUPABASE_AUTHENTICATION_SETUP.md`)

3. Remove Neon-specific code:
   - The app will automatically use Supabase instead of Neon
   - Keep `@neondatabase/serverless` for now (won't be used but won't break anything)

### Step 6: Test the Migration

1. Deploy your updated app
2. Log in with your account
3. Verify you can see your imported fuel entries
4. Create a new entry to test everything works
5. Log out and create a second test account
6. Verify the second account cannot see the first account's data

### Step 7: Migrate Receipt Images (if using S3)

Your receipt images in S3 don't need to be migrated, but you should:

1. Verify all `receipt_image_url` values in the database are correct
2. Test that images still load in the app
3. Ensure S3 bucket permissions are still correct

### Step 8: Clean Up (Optional)

After confirming everything works:

1. Keep your Neon database for a few weeks as backup
2. After you're confident, you can delete the Neon project
3. Remove `@neondatabase/serverless` from package.json if desired

## Comparison: Neon vs Supabase

| Feature | Neon | Supabase |
|---------|------|----------|
| Database | PostgreSQL | PostgreSQL |
| Authentication | Separate service needed | Built-in |
| Row Level Security | Manual setup | Automatic |
| Real-time | Not included | Included |
| Storage | Separate (S3) | Built-in option |
| Pricing | Database only | Database + Auth + Storage |

## Troubleshooting

### Issue: Import fails with "permission denied"

**Solution**: Make sure you're using the Supabase service role key for imports, not the anon key.

### Issue: Images don't load after migration

**Solution**: 
1. Check that S3 URLs are still valid
2. Verify S3 bucket CORS settings
3. Ensure AWS credentials are still in Vercel environment variables

### Issue: "relation does not exist" error

**Solution**: Make sure you ran the Supabase schema script (`scripts/supabase-schema.sql`)

## Rollback Plan

If you need to rollback to Neon:

1. Keep your Neon database active during migration
2. Revert environment variables to use `NEON_DATABASE_URL`
3. Comment out Supabase authentication code
4. Redeploy

## Cost Considerations

- **Neon Free Tier**: 0.5 GB storage, 1 project
- **Supabase Free Tier**: 500 MB database, 50 MB storage, 50,000 monthly active users

For a personal fuel logbook, both free tiers should be sufficient.

## Next Steps

After successful migration:
1. Set up email templates in Supabase
2. Configure password requirements
3. Enable two-factor authentication (optional)
4. Set up database backups in Supabase
