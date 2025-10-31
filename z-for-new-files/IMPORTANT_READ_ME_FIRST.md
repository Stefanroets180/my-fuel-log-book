# IMPORTANT: Read This First!

## Your Database Schema Was Fixed

Your project had **mismatched database schemas**. The old `supabase-fresh-schema.sql` file had WRONG column names that didn't match your application code.

## What Was Wrong

The old schema used:
- `fuel_amount` (but your app uses `liters`)
- `fuel_cost` (but your app uses `total_cost`)
- `fuel_type` (but your app uses `petrol_station`)
- Missing columns: `price_per_liter`, `km_per_liter`, `distance_traveled`, `is_work_travel`, `work_distance_km`

This would cause your app to completely fail!

## What You Need to Do

### For Fresh Setup (Recommended)

**Use these files ONLY:**

1. **`FRESH_SUPABASE_SETUP.sql`** - The CORRECT database schema
2. **`FRESH_SUPABASE_SETUP_GUIDE.md`** - Complete step-by-step instructions

**Follow the guide exactly:**
1. Delete your old Supabase organization (if it's messy)
2. Create a new Supabase project
3. Run `FRESH_SUPABASE_SETUP.sql` in Supabase SQL Editor
4. Configure your `.env.local` file
5. Run `npm install` and `npm run dev`

### Files to IGNORE

These files are OLD and have WRONG schemas:
- ❌ `supabase-fresh-schema.sql` - WRONG column names
- ❌ `scripts/001_create_fuel_entries_table.sql` - Incomplete
- ❌ `scripts/01-create-initial-schema.sql` - Missing user support
- ❌ `scripts/02-migrate-to-multi-user.sql` - For migration only
- ❌ `scripts/supabase-schema.sql` - Incomplete

## Quick Start Checklist

- [ ] Read `FRESH_SUPABASE_SETUP_GUIDE.md`
- [ ] Delete old Supabase organization (if needed)
- [ ] Create new Supabase project
- [ ] Run `FRESH_SUPABASE_SETUP.sql` in SQL Editor
- [ ] Enable Email authentication
- [ ] Create `.env.local` with your credentials
- [ ] Run `npm install`
- [ ] Run `npm run dev`
- [ ] Test signup and add a fuel entry

## Environment Variables You Need

Create `.env.local` with:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
DATABASE_URL=postgresql://postgres:password@db.your-project.supabase.co:5432/postgres
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000
\`\`\`

## What's Fixed

The new schema includes ALL the correct columns:
- ✅ `liters` (not fuel_amount)
- ✅ `price_per_liter`
- ✅ `total_cost` (not fuel_cost)
- ✅ `petrol_station` (not fuel_type)
- ✅ `is_work_travel`
- ✅ `km_per_liter`
- ✅ `distance_traveled`
- ✅ `work_distance_km`
- ✅ `is_locked`
- ✅ `notes`
- ✅ `receipt_image_url`
- ✅ Row Level Security (RLS) for data protection
- ✅ Automatic user profile creation
- ✅ Multi-user support with cars table

## Need Help?

Check the Troubleshooting section in `FRESH_SUPABASE_SETUP_GUIDE.md`

---

**Start with `FRESH_SUPABASE_SETUP_GUIDE.md` and follow it step by step!**
