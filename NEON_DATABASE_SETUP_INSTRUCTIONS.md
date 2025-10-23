# Neon Database Setup Instructions

This comprehensive guide will walk you through setting up your Neon Postgres database for the fuel logbook app, from creating the database to running the schema and testing the connection.

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

1. **Project Name:** Enter a name (e.g., `fuel-logbook-db`)
2. **Postgres Version:** Select the latest version (16 recommended)
3. **Region:** Choose the region closest to your users:
   - For South Africa: Select **Europe (Frankfurt)** or **Europe (London)** for best latency
   - Other options: US East, US West, Asia Pacific
4. Click **"Create Project"**

Neon will automatically create:
- A default database named `neondb`
- A default role/user
- Connection strings for your app

---

## Part 2: Getting Your Connection Strings

### Step 3: Locate Your Connection Details

1. After project creation, you'll see the **"Connection Details"** panel
2. You'll see several connection string formats:

   **Pooled Connection (Recommended for Vercel):**
   \`\`\`
   postgresql://[user]:[password]@[host]/[database]?sslmode=require
   \`\`\`

   **Direct Connection (For migrations and scripts):**
   \`\`\`
   postgresql://[user]:[password]@[host]/[database]?sslmode=require&direct=true
   \`\`\`

3. Click **"Copy"** next to each connection string and save them temporarily

### Step 4: Understanding the Connection Strings

Neon provides multiple environment variable formats:

- `NEON_DATABASE_URL` - Pooled connection (use this for your app)
- `DATABASE_URL_UNPOOLED` - Direct connection (use for migrations)
- `PGHOST`, `PGUSER`, `PGPASSWORD`, `PGDATABASE` - Individual components

For this app, you primarily need `DATABASE_URL`.

---

## Part 3: Connecting Neon to Your Vercel Project

### Step 5: Add Neon Integration to Vercel

#### Option A: Through Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Navigate to your project
3. Click **"Storage"** tab
4. Click **"Connect Store"** or **"Create Database"**
5. Select **"Neon"** from the options
6. Click **"Continue"**
7. You'll be redirected to authorize the connection
8. Select your Neon project (`fuel-logbook-db`)
9. Click **"Connect"**

Vercel will automatically add all necessary environment variables to your project!

#### Option B: Manual Environment Variable Setup

If you prefer to add variables manually:

1. In Vercel, go to **Settings** → **Environment Variables**
2. Add the following variables:

   | Variable Name | Value | Environments |
   |--------------|-------|--------------|
   | `DATABASE_URL` | Your pooled connection string | Production, Preview, Development |
   | `DATABASE_URL_UNPOOLED` | Your direct connection string | Production, Preview, Development |

3. Click **"Save"** for each variable

---

## Part 4: Local Development Setup

### Step 6: Set Up Local Environment Variables

For local development, you need the connection strings in your project:

#### Using Vercel CLI (Recommended)

\`\`\`bash
# Install Vercel CLI globally
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
# Neon Database Connection Strings
DATABASE_URL="postgresql://[user]:[password]@[host]/[database]?sslmode=require"
DATABASE_URL_UNPOOLED="postgresql://[user]:[password]@[host]/[database]?sslmode=require&direct=true"

# Vercel Blob Token (if not already present)
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_xxxxxxxxxxxxx"
\`\`\`

Replace the bracketed values with your actual Neon credentials.

⚠️ **Important:** Add `.env.local` to your `.gitignore` to prevent committing secrets!

---

## Part 5: Creating the Database Schema

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

This table stores:
- Fuel entry details (date, odometer, liters, price)
- Calculated fields (total cost, km/L, distance)
- Receipt image URL from Vercel Blob
- Work travel flag for SARS tax purposes
- Notes and timestamps

### Step 8: Run the Database Migration Script

The app includes a SQL script to create the table. You have two options:

#### Option A: Using Neon Console (Web Interface)

1. Go to your Neon dashboard at [console.neon.tech](https://console.neon.tech)
2. Select your project (`fuel-logbook-db`)
3. Click **"SQL Editor"** in the left sidebar
4. Copy the contents of `scripts/001_create_fuel_entries_table.sql` from your project
5. Paste it into the SQL Editor
6. Click **"Run"** or press `Ctrl+Enter` (Windows) / `Cmd+Enter` (Mac)
7. You should see: `CREATE TABLE` success message

#### Option B: Using the App's Built-in Script Runner

The app can run SQL scripts directly:

1. Make sure your `.env.local` file has the `DATABASE_URL_UNPOOLED` variable
2. Start your development server:
   \`\`\`bash
   npm run dev
   \`\`\`
3. The script in the `scripts/` folder will be detected
4. Navigate to your app and look for a "Run Database Scripts" option (if implemented)

#### Option C: Using psql Command Line (Advanced)

If you have PostgreSQL installed locally:

\`\`\`bash
# Run the migration script
psql "postgresql://[user]:[password]@[host]/[database]?sslmode=require" -f scripts/001_create_fuel_entries_table.sql
\`\`\`

---

## Part 6: Verifying the Database Setup

### Step 9: Check Table Creation

Verify the table was created successfully:

1. Go to Neon Console → **SQL Editor**
2. Run this query:
   \`\`\`sql
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_schema = 'public';
   \`\`\`
3. You should see `fuel_entries` in the results

### Step 10: Check Table Structure

Verify the columns are correct:

\`\`\`sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'fuel_entries'
ORDER BY ordinal_position;
\`\`\`

You should see all 13 columns listed.

### Step 11: Test with Sample Data (Optional)

Insert a test record to verify everything works:

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

-- Verify it was inserted
SELECT * FROM fuel_entries;
\`\`\`

If you see your test record, the database is working correctly!

---

## Part 7: Testing the Connection from Your App

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

3. **Delete an entry:**
   - Click the delete button on an entry
   - Confirm deletion
   - Entry should be removed

If all these work, your database is fully connected and operational!

---

## Part 8: Understanding Neon's Free Tier

### What's Included (Free Tier)

- **Storage:** 0.5 GB (plenty for thousands of fuel entries)
- **Compute:** 191.9 hours/month of active time
- **Projects:** 1 project
- **Branches:** 10 database branches
- **Databases:** Unlimited databases per project

### How Compute Hours Work

Neon uses "scale-to-zero" technology:
- Database automatically suspends after 5 minutes of inactivity
- Wakes up instantly when accessed (< 1 second)
- Only counts active time toward your 191.9 hours
- Perfect for personal projects and development

### Monitoring Usage

1. Go to Neon Console
2. Click **"Usage"** in the left sidebar
3. View:
   - Storage used
   - Compute hours consumed
   - Active time per day
   - Data transfer

---

## Part 9: Database Management Best Practices

### Backup Your Data

Neon automatically backs up your data, but you can also:

1. **Export data manually:**
   \`\`\`sql
   COPY fuel_entries TO STDOUT WITH CSV HEADER;
   \`\`\`

2. **Use the S3 export feature** built into the app (see AWS S3 setup guide)

### Monitor Performance

1. Go to Neon Console → **Monitoring**
2. View:
   - Query performance
   - Connection count
   - Database size over time

### Database Branching (Advanced)

Neon's unique feature - create instant database copies:

1. Go to **Branches** in Neon Console
2. Click **"New Branch"**
3. Use for:
   - Testing migrations
   - Development environments
   - Feature testing without affecting production

---

## Part 10: Troubleshooting

### Issue: "Connection refused" or "Could not connect"

**Solutions:**
- Verify `DATABASE_URL` is correctly set in `.env.local`
- Check that you're using the pooled connection string
- Ensure `?sslmode=require` is in the connection string
- Restart your development server

### Issue: "Table does not exist"

**Solutions:**
- Run the migration script again (Step 8)
- Verify you're connected to the correct database
- Check the SQL Editor for any error messages

### Issue: "Too many connections"

**Solutions:**
- Use the pooled connection string (`DATABASE_URL`)
- Neon's connection pooler handles this automatically
- Check for connection leaks in your code

### Issue: "SSL connection required"

**Solutions:**
- Ensure your connection string includes `?sslmode=require`
- Neon requires SSL for all connections

### Issue: Slow queries or timeouts

**Solutions:**
- Check Neon Console → Monitoring for performance issues
- Ensure your database hasn't been suspended (first query after suspension takes ~1 second)
- Consider adding indexes for frequently queried columns

---

## Part 11: Production Deployment Checklist

Before deploying to production:

- [ ] Neon integration connected to Vercel
- [ ] Environment variables set in Vercel (Production environment)
- [ ] Database schema created (`fuel_entries` table exists)
- [ ] Test data inserted and verified
- [ ] App successfully connects and performs CRUD operations
- [ ] Backup strategy in place (S3 export configured)
- [ ] Monitoring set up in Neon Console

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
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Neon Community Discord](https://discord.gg/neon)

---

## Quick Reference: Common SQL Queries

### View all fuel entries
\`\`\`sql
SELECT * FROM fuel_entries ORDER BY date DESC;
\`\`\`

### Get total spent
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
SELECT * FROM fuel_entries 
WHERE is_work_travel = true 
ORDER BY date DESC;
\`\`\`

### Delete all test data
\`\`\`sql
DELETE FROM fuel_entries WHERE notes LIKE '%test%';
\`\`\`

### Reset the table (careful!)
\`\`\`sql
TRUNCATE TABLE fuel_entries RESTART IDENTITY;
