# Quick Start Guide - Fuel Logbook App

## 🚀 First Time Setup

If you're seeing a database error, follow these steps:

### 1. Run the Database Migration

The app needs the `fuel_entries` table to be created in your Supabase database. 

**In v0 (if you haven't deployed yet):**
- The SQL script at `scripts/001_create_fuel_entries_table.sql` will run automatically when you execute it
- Click the "Run" button next to the script file in v0

**After deploying to Vercel:**
1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project
3. Click on "SQL Editor" in the left sidebar
4. Copy the contents of `supabase-fresh-schema.sql`
5. Paste into the SQL Editor and click "Run"

### 2. Verify Environment Variables

Make sure these environment variables are set in your Vercel project:

**Database:**
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key

**AWS S3 (for receipt storage):**
- `AWS_ACCESS_KEY_ID` - Your AWS access key
- `AWS_SECRET_ACCESS_KEY` - Your AWS secret key
- `AWS_REGION` - Your S3 bucket region (e.g., us-east-1)
- `AWS_S3_BUCKET_NAME` - Your S3 bucket name

### 3. Test the Connection

After running the migration:
1. Refresh your app
2. You should see the empty state: "No fuel entries yet"
3. Try adding your first fuel entry!

## 📝 Adding Your First Entry

1. Fill in the form with your fuel purchase details
2. Upload a receipt image (optional) - stored in AWS S3
3. Check "Work Travel" if applicable for SARS
4. Click "Add Entry"

The app will automatically calculate:
- Total cost (liters × price per liter)
- km/L consumption (from previous entry)
- Distance traveled since last fill-up

## 🔧 Troubleshooting

**"relation 'fuel_entries' does not exist"**
- Run the database migration script (see step 1 above)

**"Failed to fetch entries"**
- Check that Supabase environment variables are set correctly
- Verify your Supabase project is active

**Receipt upload fails**
- Check that all AWS S3 environment variables are set
- Verify your S3 bucket exists and has proper permissions
- See AWS_S3_RECEIPT_SETUP.md for detailed setup instructions

## 📚 Full Documentation

- [Supabase Fresh Setup](./SUPABASE_FRESH_SETUP.md)
- [Supabase Authentication Setup](./SUPABASE_AUTHENTICATION_SETUP.md)
- [AWS S3 Receipt Setup](./AWS_S3_RECEIPT_SETUP.md)
- [AWS S3 Export Setup](./AWS_S3_SETUP_INSTRUCTIONS.md)
- [Fresh Deployment Guide](./FRESH_DEPLOYMENT_GUIDE.md)
