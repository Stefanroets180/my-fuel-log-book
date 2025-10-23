# Quick Start Guide - Fuel Logbook App

## 🚀 First Time Setup

If you're seeing a database error, follow these steps:

### 1. Run the Database Migration

The app needs the `fuel_entries` table to be created in your Neon database. 

**In v0 (if you haven't deployed yet):**
- The SQL script at `scripts/001_create_fuel_entries_table.sql` will run automatically when you execute it
- Click the "Run" button next to the script file in v0

**After deploying to Vercel:**
1. Go to your Neon dashboard: https://console.neon.tech
2. Select your project
3. Click on "SQL Editor" in the left sidebar
4. Copy the contents of `scripts/001_create_fuel_entries_table.sql`
5. Paste into the SQL Editor and click "Run"

### 2. Verify Environment Variables

Make sure these environment variables are set in your Vercel project:

- `NEON_NEON_DATABASE_URL` - Your Neon database connection string
- `BLOB_READ_WRITE_TOKEN` - Your Vercel Blob storage token

### 3. Test the Connection

After running the migration:
1. Refresh your app
2. You should see the empty state: "No fuel entries yet"
3. Try adding your first fuel entry!

## 📝 Adding Your First Entry

1. Fill in the form with your fuel purchase details
2. Upload a receipt image (optional)
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
- Check that NEON_DATABASE_URL is set correctly
- Verify your Neon database is active (not paused)

**Receipt upload fails**
- Check that BLOB_READ_WRITE_TOKEN is set
- Verify Vercel Blob is enabled in your project

## 📚 Full Documentation

- [Neon Database Setup](./NEON_DATABASE_SETUP_INSTRUCTIONS.md)
- [Vercel Blob Setup](./VERCEL_BLOB_SETUP_INSTRUCTIONS.md)
- [AWS S3 Setup](./AWS_S3_SETUP_INSTRUCTIONS.md)
- [Fresh Deployment Guide](./FRESH_DEPLOYMENT_GUIDE.md)
