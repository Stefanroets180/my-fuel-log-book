# Neon Database Setup Instructions (Updated for 2025)

This comprehensive guide will walk you through setting up your Neon Postgres database for the fuel logbook app using the latest Neon Console interface.

## What is Neon?

Neon is a serverless Postgres database that's perfect for modern applications. It offers:
- Automatic scaling
- Instant database branching
- Generous free tier
- Built-in connection pooling
- No server management required

---

## Part 1: Creating Your Neon Database

### Step 1: Sign Up for Neon

1. Go to [neon.tech](https://neon.tech)
2. Click **"Sign Up"** in the top right
3. Sign up using:
   - GitHub account (recommended for developers)
   - Google account
   - Email and password

### Step 2: Create Your First Project

After signing up, you'll be prompted to create a project:

1. Click **"New Project"** button
2. **Project Name:** Enter a name (e.g., `fuel-logbook-db`)
3. **Postgres Version:** Select the latest version (17 or 16 recommended)
4. **Cloud Provider:** Choose your preferred provider (AWS, Google Cloud, or Azure)
5. **Region:** Choose the region closest to your users:
   - For South Africa: Select **Europe (Frankfurt)** or **Europe (London)** for best latency
   - Other options: US East, US West, Asia Pacific, etc.
6. Click **"Create Project"**

Neon will automatically create:
- A default database named `neondb`
- A default branch called `main`
- A default role/user
- Connection strings for your app

---

## Part 2: Getting Your Connection Strings

### Step 3: Locate Your Connection Details

After project creation, you'll see the **"Connection Details"** section:

1. Look for the **"Connection string"** dropdown at the top of your project dashboard
2. You'll see different connection options:
   - **Pooled connection** (recommended for applications)
   - **Direct connection** (for migrations and admin tasks)

3. The connection string format looks like:
   \`\`\`
   postgresql://[user]:[password]@[host]/[database]?sslmode=require
   \`\`\`

4. Click the **"Copy"** icon next to the connection string

### Step 4: Understanding Connection String Options

In the connection string dropdown, you'll see:

- **Database:** Select `neondb` (default) or create a new database
- **Role:** Your default role (usually matches your project name)
- **Branch:** `main` (default) or other branches you've created
- **Connection type:**
  - **Pooled** - Use this for your Next.js app (handles many connections efficiently)
  - **Direct** - Use for running migrations and SQL scripts

💡 **Tip:** For this app, copy the **Pooled** connection string.

---

## Part 3: Connecting Neon to Your Vercel Project

### Step 5: Add Neon Integration to Vercel

#### Option A: Through Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Navigate to your project (or create a new one)
3. Click the **"Storage"** tab in the top navigation
4. Click **"Connect Store"** or **"Create Database"**
5. Select **"Neon"** from the database options
6. Click **"Continue"**
7. Authorize the connection when prompted
8. Select your Neon project (`fuel-logbook-db`)
9. Click **"Connect"**

✅ Vercel will automatically add all necessary environment variables to your project!

The following variables will be added:
- `NEON_NEON_DATABASE_URL` (pooled connection)
- `NEON_DATABASE_URL_UNPOOLED` (direct connection)
- `NEON_PGHOST`, `NEON_PGUSER`, `NEON_PGPASSWORD`, `NEON_PGDATABASE`
- And more...

#### Option B: Manual Environment Variable Setup

If you prefer to add variables manually:

1. In Vercel, go to **Settings** → **Environment Variables**
2. Add this variable:

   | Variable Name | Value | Environments |
   |--------------|-------|--------------|
   | `NEON_DATABASE_URL` | Your pooled connection string | Production, Preview, Development |

3. Click **"Save"**

---

## Part 4: Local Development Setup

### Step 6: Set Up Local Environment Variables

For local development, you need the connection string in your project:

#### Using Vercel CLI (Recommended)

\`\`\`bash
# Install Vercel CLI globally (if not already installed)
npm install -g vercel

# Navigate to your project directory
cd fuel-logbook-app

# Link your local project to Vercel
vercel link

# Pull environment variables from Vercel
vercel env pull .env.local
\`\`\`

This creates a `.env.local` file with all your environment variables, including the Neon connection strings.

#### Manual Setup (Alternative)

Create a `.env.local` file in your project root:

\`\`\`env
# Neon Database Connection String
NEON_DATABASE_URL="postgresql://[user]:[password]@[host]/[database]?sslmode=require"

# Vercel Blob Token (if not already present)
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_xxxxxxxxxxxxx"
\`\`\`

Replace the bracketed values with your actual Neon credentials from Step 3.

⚠️ **Important:** Add `.env.local` to your `.gitignore` to prevent committing secrets!

---

## Part 5: Creating the Database Schema (New 2025 Interface)

### Step 7: Understanding the Schema

The fuel logbook app uses a single table called `fuel_entries` with the following structure:

\`\`\`sql
CREATE TABLE fuel_entries (
  id SERIAL PRIMARY KEY,
  date TIMESTAMP NOT NULL,
  odometer_reading INTEGER NOT NULL,
  liters DECIMAL(10, 2) NOT NULL,
  price_per_liter DECIMAL(10, 2) NOT NULL,
  total_cost DECIMAL(10, 2) NOT NULL,
  petrol_station VARCHAR(255),
  receipt_url TEXT,
  is_work_travel BOOLEAN DEFAULT FALSE,
  notes TEXT,
  km_per_liter DECIMAL(10, 2),
  distance_traveled INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

### Step 8: Run the Database Migration Script

The Neon Console now offers multiple ways to create tables. Choose the method that works best for you:

#### Option A: Using SQL Editor (Traditional Method)

1. Go to [console.neon.tech](https://console.neon.tech)
2. Select your project (`fuel-logbook-db`)
3. In the left sidebar, click **"SQL Editor"**
4. You'll see a query editor interface
5. Copy the contents of `scripts/001_create_fuel_entries_table.sql` from your project
6. Paste it into the SQL Editor
7. Click the **"Run"** button (or press `Ctrl+Enter` / `Cmd+Enter`)
8. You should see a success message: `CREATE TABLE`

💡 **New Feature:** The SQL Editor now includes:
- Query history (see your past queries)
- Saved queries (bookmark frequently used queries)
- Explain/Analyze buttons (understand query performance)

#### Option B: Using the New Tables Interface (Visual Method)

The 2025 Neon Console includes a visual **Tables** page powered by Drizzle Studio:

1. Go to [console.neon.tech](https://console.neon.tech)
2. Select your project
3. In the left sidebar, click **"Tables"**
4. Click **"Create Table"** button
5. You'll see a visual interface to:
   - Add table name: `fuel_entries`
   - Add columns one by one with their types
   - Set primary keys, defaults, and constraints
   - Preview the SQL that will be generated

**However**, for this app with 13 columns, using the SQL Editor (Option A) is faster and more reliable.

#### Option C: Using psql Command Line (Advanced)

If you have PostgreSQL installed locally:

\`\`\`bash
# Use the direct (unpooled) connection for migrations
psql "postgresql://[user]:[password]@[host]/[database]?sslmode=require" \
  -f scripts/001_create_fuel_entries_table.sql
\`\`\`

---

## Part 6: Verifying the Database Setup (New 2025 Interface)

### Step 9: Check Table Creation Using Tables Page

The easiest way to verify your table in the new interface:

1. Go to Neon Console
2. Select your project
3. Click **"Tables"** in the left sidebar
4. You should see `fuel_entries` listed
5. Click on the table name to view:
   - All columns and their types
   - Existing data (initially empty)
   - Table structure

### Step 10: Check Table Structure Using SQL Editor

Alternatively, verify using SQL:

1. Go to **SQL Editor**
2. Run this query:
   \`\`\`sql
   SELECT column_name, data_type, is_nullable, column_default
   FROM information_schema.columns
   WHERE table_name = 'fuel_entries'
   ORDER BY ordinal_position;
   \`\`\`
3. You should see all 13 columns listed with their types

### Step 11: Test with Sample Data

Insert a test record to verify everything works:

1. In the **SQL Editor**, run:
   \`\`\`sql
   INSERT INTO fuel_entries (
     date,
     odometer_reading,
     liters,
     price_per_liter,
     total_cost,
     petrol_station,
     is_work_travel,
     notes
   ) VALUES (
     CURRENT_TIMESTAMP,
     50000,
     45.50,
     23.95,
     1089.73,
     'Shell V-Power',
     false,
     'Test entry'
   );
   \`\`\`

2. Verify it was inserted:
   \`\`\`sql
   SELECT * FROM fuel_entries;
   \`\`\`

3. **Or** use the new **Tables** interface:
   - Go to **Tables** → `fuel_entries`
   - You'll see your test record displayed visually
   - You can edit, delete, or add records directly from this interface!

---

## Part 7: Using the New Tables Interface Features (2025)

### Managing Data Visually

The new **Tables** page lets you manage data without writing SQL:

**Add Records:**
1. Click **"Add row"** button
2. Fill in the form with your data
3. Click **"Save"**

**Edit Records:**
1. Click on any cell in the table
2. Edit the value directly
3. Changes save automatically

**Delete Records:**
1. Select rows using checkboxes
2. Click **"Delete"** button
3. Confirm deletion

**Filter Data:**
1. Click the filter icon on any column
2. Set filter conditions (equals, contains, greater than, etc.)
3. View filtered results

**Export Data:**
1. Click the **"Export"** button
2. Choose format: JSON or CSV
3. Download your data

### Managing Schema Visually

**Add Columns:**
1. Click **"Add column"** button
2. Specify column name, type, and constraints
3. Click **"Create"**

**Modify Columns:**
1. Click the settings icon next to a column
2. Change type, add/remove constraints
3. Apply changes

**Drop Table:**
1. Click the table settings (three dots)
2. Select **"Drop table"**
3. Confirm (⚠️ this deletes all data!)

**Truncate Table:**
1. Click the table settings
2. Select **"Truncate table"**
3. This removes all rows but keeps the structure

---

## Part 8: Testing the Connection from Your App

### Step 12: Start Your Development Server

\`\`\`bash
npm run dev
\`\`\`

Open your browser to `http://localhost:3000`

### Step 13: Test Database Operations

1. **Create a fuel entry:**
   - Fill out the form with test data
   - Click "Add Entry"
   - You should see a success message

2. **View entries:**
   - The dashboard should display your entry
   - Check that km/L is calculated correctly

3. **Verify in Neon Console:**
   - Go to **Tables** → `fuel_entries`
   - You should see the entry you just created!

4. **Delete an entry:**
   - Click the delete button in your app
   - Confirm deletion
   - Check the Tables page - entry should be gone

If all these work, your database is fully connected and operational! 🎉

---

## Part 9: Understanding Neon's Free Tier

### What's Included (Free Tier - 2025)

- **Storage:** 0.5 GB (enough for thousands of fuel entries)
- **Compute:** 191.9 hours/month of active time
- **Projects:** 1 project
- **Branches:** 10 database branches per project
- **Databases:** Unlimited databases per project
- **Data transfer:** 5 GB/month

### How Compute Hours Work

Neon uses "scale-to-zero" technology:
- Database automatically suspends after 5 minutes of inactivity
- Wakes up instantly when accessed (< 1 second cold start)
- Only counts active time toward your 191.9 hours
- Perfect for personal projects and development

### Monitoring Usage

1. Go to Neon Console
2. Click **"Monitoring"** in the left sidebar
3. View:
   - Storage used (with graph over time)
   - Compute hours consumed
   - Active time per day
   - Data transfer
   - Connection count

---

## Part 10: Database Management Best Practices

### Backup Your Data

Neon automatically backs up your data with point-in-time restore, but you can also:

1. **Export using the Tables interface:**
   - Go to **Tables** → `fuel_entries`
   - Click **"Export"**
   - Choose JSON or CSV format
   - Download the file

2. **Export using SQL:**
   \`\`\`sql
   COPY fuel_entries TO STDOUT WITH CSV HEADER;
   \`\`\`

3. **Use the S3 export feature** built into the app (see AWS S3 setup guide)

### Monitor Performance

1. Go to Neon Console → **Monitoring**
2. View:
   - Query performance metrics
   - Connection count over time
   - Database size growth
   - Compute usage patterns

### Database Branching (Advanced Feature)

Neon's unique feature - create instant database copies:

1. Go to **Branches** in Neon Console
2. Click **"New Branch"**
3. Choose:
   - Branch from `main` (current state)
   - Branch from a specific point in time
4. Use branches for:
   - Testing migrations safely
   - Development environments
   - Feature testing without affecting production
   - Creating staging environments

---

## Part 11: Troubleshooting

### Issue: "Connection refused" or "Could not connect"

**Solutions:**
- Verify `NEON_DATABASE_URL` is correctly set in `.env.local`
- Check that you're using the **pooled** connection string
- Ensure `?sslmode=require` is in the connection string
- Restart your development server: `npm run dev`
- Check Neon Console → **Monitoring** to see if database is active

### Issue: "Table does not exist"

**Solutions:**
- Run the migration script again (Step 8, Option A)
- Verify the table exists: Go to **Tables** page in Neon Console
- Check you're connected to the correct database and branch
- Look at SQL Editor query history to see if CREATE TABLE ran successfully

### Issue: "Too many connections"

**Solutions:**
- Make sure you're using the **pooled** connection string (not direct)
- Neon's connection pooler handles this automatically
- Check for connection leaks in your code (unclosed connections)
- Monitor connections in **Monitoring** page

### Issue: "SSL connection required"

**Solutions:**
- Ensure your connection string includes `?sslmode=require`
- Neon requires SSL for all connections (security best practice)
- Don't remove the SSL parameter

### Issue: Slow queries or timeouts

**Solutions:**
- Check **Monitoring** page for performance issues
- First query after database suspension takes ~1 second (normal)
- Use the SQL Editor's **"Explain"** button to analyze query performance
- Consider adding indexes for frequently queried columns
- Check if you're on the free tier and approaching compute limits

### Issue: Can't see the Tables page

**Solutions:**
- Make sure you're using the latest Neon Console (clear browser cache)
- The Tables page is available for all projects created after June 2024
- Try accessing directly: `console.neon.tech/app/projects/[your-project-id]/tables`

---

## Part 12: Production Deployment Checklist

Before deploying to production:

- [ ] Neon integration connected to Vercel
- [ ] Environment variables set in Vercel (Production environment)
- [ ] Database schema created (`fuel_entries` table exists)
- [ ] Verified table structure in Tables page
- [ ] Test data inserted and verified
- [ ] App successfully connects and performs CRUD operations
- [ ] Backup strategy in place (S3 export configured)
- [ ] Monitoring set up in Neon Console
- [ ] Free tier limits understood and monitored

---

## Next Steps

✅ Your Neon database is now fully set up and ready to use!

The fuel logbook app will automatically:
- Connect to your Neon database using the environment variables
- Store all fuel entries securely
- Calculate km/L and distance traveled
- Handle all CRUD operations efficiently

For production deployment, simply push your code to Vercel, and it will automatically use the production database connection.

---

## Additional Resources

- [Neon Documentation](https://neon.tech/docs)
- [Neon + Vercel Integration Guide](https://neon.tech/docs/guides/vercel)
- [Managing Tables in Neon Console](https://neon.tech/docs/guides/tables)
- [Neon SQL Editor Guide](https://neon.tech/docs/get-started-with-neon/query-with-neon-sql-editor)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Neon Community Discord](https://discord.gg/neon)

---

## Quick Reference: Common SQL Queries

### View all fuel entries
\`\`\`sql
SELECT * FROM fuel_entries ORDER BY date DESC;
\`\`\`

### Get total spent (in ZAR)
\`\`\`sql
SELECT SUM(total_cost) as total_spent FROM fuel_entries;
\`\`\`

### Get average km/L
\`\`\`sql
SELECT AVG(km_per_liter) as avg_consumption 
FROM fuel_entries 
WHERE km_per_liter IS NOT NULL;
\`\`\`

### Get work travel entries (for SARS)
\`\`\`sql
SELECT 
  date,
  odometer_reading,
  distance_traveled,
  total_cost,
  petrol_station
FROM fuel_entries 
WHERE is_work_travel = true 
ORDER BY date DESC;
\`\`\`

### Get monthly summary
\`\`\`sql
SELECT 
  DATE_TRUNC('month', date) as month,
  COUNT(*) as fill_ups,
  SUM(liters) as total_liters,
  SUM(total_cost) as total_spent,
  AVG(km_per_liter) as avg_consumption
FROM fuel_entries
GROUP BY DATE_TRUNC('month', date)
ORDER BY month DESC;
\`\`\`

### Delete test data
\`\`\`sql
DELETE FROM fuel_entries WHERE notes LIKE '%test%';
\`\`\`

### Reset the table (⚠️ careful - deletes all data!)
\`\`\`sql
TRUNCATE TABLE fuel_entries RESTART IDENTITY;
\`\`\`

---

## What's New in 2025 Neon Console

The Neon Console has been significantly improved with:

✨ **Visual Tables Interface** - Manage data and schemas without writing SQL
✨ **Enhanced SQL Editor** - Query history, saved queries, and performance analysis
✨ **Improved Monitoring** - Better insights into usage and performance
✨ **Streamlined Navigation** - Easier access to all features
✨ **Drizzle Studio Integration** - Professional database management UI

These updates make Neon even easier to use while maintaining its powerful serverless capabilities!
