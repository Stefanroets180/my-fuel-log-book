# Neon Fresh Setup Guide

This guide walks you through setting up a brand new Neon PostgreSQL database for your Fuel Logbook app from scratch.

## Prerequisites

- A Neon account (sign up at https://neon.tech)
- Your Fuel Logbook app code
- Basic understanding of SQL

---

## Step 1: Create a New Neon Project

1. **Log in to Neon Console**
   - Go to https://console.neon.tech
   - Sign in with your account (GitHub, Google, or email)

2. **Create New Project**
   - Click "New Project" or "Create Project"
   - Fill in the details:
     - **Project Name**: `fuel-logbook` (or your preferred name)
     - **Postgres Version**: 16 (latest stable)
     - **Region**: Choose the closest region to your users
     - **Compute Size**: Shared (free tier is fine for getting started)
   - Click "Create Project"
   - Wait a few seconds for the project to be provisioned

3. **Note Your Connection Details**
   - After creation, you'll see your connection string
   - It looks like: `postgresql://username:password@host/database`
   - **Save this connection string** - you'll need it later

---

## Step 2: Access the SQL Editor

1. **Open SQL Editor**
   - In your Neon project dashboard
   - Click "SQL Editor" in the left sidebar
   - Or click "Tables" → "Run SQL"

2. **Verify Connection**
   - You should see a query editor interface
   - The database name should be visible at the top

---

## Step 3: Run the Database Schema

1. **Copy the Schema File**
   - Open the `neon-fresh-schema.sql` file from your project
   - Copy the entire contents

2. **Paste into SQL Editor**
   - Paste the schema into the Neon SQL Editor
   - Review the SQL to understand what will be created

3. **Execute the Schema**
   - Click "Run" or press the execute button
   - You should see success messages for each statement
   - This creates:
     - 3 tables (users, cars, fuel_entries)
     - Indexes for performance
     - Triggers for automatic timestamps
     - Functions for business logic

4. **Verify Tables Created**
   - Click "Tables" in the left sidebar
   - You should see:
     - `users`
     - `cars`
     - `fuel_entries`
   - Click on each table to see its structure

---

## Step 4: Get Your Connection String

1. **Navigate to Connection Details**
   - Click "Dashboard" in the left sidebar
   - Find the "Connection Details" section
   - Or click "Connection String" at the top

2. **Copy Your Connection String**
   - You'll see different formats available
   - Choose **"Pooled connection"** for production use
   - The format is:
     \`\`\`
     postgresql://username:password@ep-xxxxx.region.aws.neon.tech/dbname?sslmode=require
     \`\`\`
   - Click the copy icon to copy it

3. **Important Notes**
   - The connection string contains your password
   - Keep it secret and never commit to public repositories
   - Use pooled connections for serverless environments (like Vercel)
   - Use direct connections for long-running processes

---

## Step 5: Configure Environment Variables

1. **Create/Update `.env.local` File**
   In your project root, create or update `.env.local`:

   \`\`\`env
   # Neon Database Configuration
   DATABASE_URL=postgresql://username:password@ep-xxxxx.region.aws.neon.tech/dbname?sslmode=require
   
   # AWS S3 Configuration
   AWS_ACCESS_KEY_ID=your-access-key
   AWS_SECRET_ACCESS_KEY=your-secret-key
   AWS_REGION=your-region
   AWS_S3_BUCKET_NAME=fuel-logbook-receipts
   
   # Optional: For future Supabase auth integration
   # NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
   # NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   # SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   \`\`\`

2. **Replace Placeholder Values**
   - Replace `DATABASE_URL` with your actual Neon connection string
   - Ensure you're using the **pooled connection** string
   - Keep your AWS S3 credentials

3. **Add to Vercel (for Production)**
   - Go to your Vercel project dashboard
   - Click "Settings" → "Environment Variables"
   - Add `DATABASE_URL` with your Neon connection string
   - Set environment: Production, Preview, Development (as needed)
   - Click "Save"

---

## Step 6: Test Database Connection

1. **Start Development Server**
   \`\`\`bash
   npm run dev
   \`\`\`

2. **Check Console for Errors**
   - Look for any database connection errors
   - If you see "Connection successful" or no errors, you're good!

3. **Test Creating a Fuel Entry**
   - Navigate to `http://localhost:3000`
   - Try creating a fuel entry
   - Fill in all required fields
   - Click "Add Entry"

4. **Verify in Neon Console**
   - Go back to Neon Console
   - Click "Tables" → "fuel_entries"
   - Click "View Data" or run:
     \`\`\`sql
     SELECT * FROM fuel_entries ORDER BY created_at DESC LIMIT 10;
     \`\`\`
   - You should see your test entry

---

## Step 7: Optional - Create a Test User

If you want to test the multi-user features without setting up Supabase authentication yet:

1. **Run in SQL Editor**
   \`\`\`sql
   INSERT INTO users (email, full_name)
   VALUES ('test@example.com', 'Test User')
   RETURNING *;
   \`\`\`

2. **Note the User ID**
   - Copy the `id` value returned
   - You can use this for testing

3. **Create a Test Car**
   \`\`\`sql
   INSERT INTO cars (user_id, make, model, year, registration_number, is_default)
   VALUES ('your-user-id-here', 'Toyota', 'Camry', 2020, 'ABC123', true)
   RETURNING *;
   \`\`\`

4. **Create a Test Fuel Entry**
   \`\`\`sql
   INSERT INTO fuel_entries (
     user_id, 
     car_id, 
     date, 
     odometer_reading, 
     fuel_amount, 
     fuel_cost,
     fuel_type,
     is_full_tank
   )
   VALUES (
     'your-user-id-here',
     'your-car-id-here',
     CURRENT_DATE,
     50000.00,
     45.50,
     65.75,
     'Petrol',
     true
   )
   RETURNING *;
   \`\`\`

---

## Step 8: Understanding the Schema

### Users Table
- Stores user profile information
- Ready for Supabase authentication integration
- Can be used standalone for now

### Cars Table
- Stores vehicle information
- Links to users via `user_id`
- Supports multiple cars per user
- `is_default` flag for primary vehicle

### Fuel Entries Table
- Stores all fuel log entries
- Links to both users and cars
- Includes all tracking fields:
  - Basic: date, odometer, fuel amount/cost
  - Optional: work_distance, notes, receipt
  - Features: is_locked, is_full_tank

---

## Step 9: Monitor Your Database

1. **Check Database Usage**
   - In Neon Console, click "Dashboard"
   - View metrics:
     - Storage used
     - Compute time
     - Active connections
     - Query performance

2. **View Query History**
   - Click "Monitoring" in the left sidebar
   - See recent queries and their performance
   - Identify slow queries if needed

3. **Set Up Alerts (Optional)**
   - Configure alerts for storage limits
   - Get notified of connection issues
   - Monitor compute usage

---

## Step 10: Production Best Practices

1. **Use Connection Pooling**
   - Always use the pooled connection string in production
   - Format: `postgresql://...?sslmode=require&pgbouncer=true`
   - This prevents connection exhaustion

2. **Enable SSL**
   - Ensure `sslmode=require` is in your connection string
   - This encrypts data in transit

3. **Backup Strategy**
   - Neon automatically backs up your data
   - You can restore to any point in time (within retention period)
   - Free tier: 7 days retention
   - Paid tiers: 30+ days retention

4. **Scale as Needed**
   - Start with free tier
   - Upgrade to paid tier when you need:
     - More storage (>512 MB)
     - More compute time
     - Longer backup retention
     - Dedicated compute

---

## Troubleshooting

### Issue: "Connection refused" or "Connection timeout"

**Solution:**
- Verify your connection string is correct
- Check that you're using the pooled connection
- Ensure `sslmode=require` is in the connection string
- Verify your IP isn't blocked (Neon allows all IPs by default)

### Issue: "Password authentication failed"

**Solution:**
- Double-check your connection string
- Ensure you copied the entire string including the password
- Try resetting your database password in Neon Console
- Update your `.env.local` with the new connection string

### Issue: "Too many connections"

**Solution:**
- Use the pooled connection string (includes `pgbouncer=true`)
- Close unused database connections in your code
- Consider upgrading to a paid plan for more connections

### Issue: "Table does not exist"

**Solution:**
- Verify you ran the schema script successfully
- Check the SQL Editor for any error messages
- Try running the schema script again
- Verify you're connected to the correct database

### Issue: "SSL connection required"

**Solution:**
- Add `?sslmode=require` to your connection string
- Neon requires SSL for all connections
- Update your `.env.local` and Vercel environment variables

---

## Migrating from Existing Neon Database

If you already have a Neon database with fuel entries:

1. **Backup Existing Data**
   \`\`\`sql
   -- Export existing fuel entries
   SELECT * FROM fuel_entries;
   \`\`\`
   - Save the results as CSV or JSON

2. **Run Migration Script**
   - Use `scripts/003_add_work_distance_and_lock.sql`
   - This adds new columns to existing tables

3. **Verify Migration**
   \`\`\`sql
   -- Check new columns exist
   SELECT column_name, data_type 
   FROM information_schema.columns 
   WHERE table_name = 'fuel_entries';
   \`\`\`

---

## Next Steps

- **Test Your App**: Create fuel entries and verify they're saved
- **Add Cars**: Use the car management feature (when Supabase auth is enabled)
- **Set Up Authentication**: Follow `SUPABASE_AUTHENTICATION_SETUP.md`
- **Deploy to Production**: Push to Vercel with environment variables configured
- **Monitor Performance**: Use Neon Console to track database usage

---

## Additional Resources

- [Neon Documentation](https://neon.tech/docs)
- [Neon Connection Pooling](https://neon.tech/docs/connect/connection-pooling)
- [Neon Branching](https://neon.tech/docs/introduction/branching)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

## Support

If you encounter issues:
1. Check the Troubleshooting section above
2. Review Neon Console logs and monitoring
3. Check browser console for errors
4. Verify environment variables are set correctly
5. Test connection string with a PostgreSQL client

Your Neon database is now ready to use! 🚀
