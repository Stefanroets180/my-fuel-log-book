# Fresh Supabase Setup Guide - Fuel Logbook App

This guide will walk you through setting up a brand new Supabase organization and deploying your Fuel Logbook application from scratch.

## Prerequisites

- Node.js 18+ installed on your computer
- A web browser
- This project code on your computer

---

## Part 1: Delete Old Supabase Organization (If Needed)

If you have an existing Supabase organization that's messy and you want to start fresh:

### Step 1: Delete Your Old Organization

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in to your account
3. Click on your profile icon (top right corner)
4. Click **"Organization settings"**
5. Scroll down to the **"Danger Zone"** section
6. Click **"Delete organization"**
7. Type the organization name to confirm
8. Click **"Delete organization"** button

**Important:** This will permanently delete ALL projects in that organization. Make sure you have backups of any important data.

---

## Part 2: Create Fresh Supabase Organization & Project

### Step 2: Create New Organization

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in (or sign up if you deleted your account)
3. Click **"New organization"** or **"Create organization"**
4. Enter an organization name (e.g., "My Fuel Logbook")
5. Click **"Create organization"**

### Step 3: Create New Project

1. Click **"New project"** button
2. Fill in the project details:
   - **Name**: `fuel-logbook` (or any name you prefer)
   - **Database Password**: Create a STRONG password and **SAVE IT SOMEWHERE SAFE**
   - **Region**: Choose the region closest to you
   - **Pricing Plan**: Free (or paid if you prefer)
3. Click **"Create new project"**
4. Wait 2-3 minutes for the project to be created

---

## Part 3: Set Up Database Schema

### Step 4: Run the Database Setup Script

1. In your Supabase project dashboard, click **"SQL Editor"** in the left sidebar
2. Click **"New query"** button
3. Open the file `FRESH_SUPABASE_SETUP.sql` from your project folder
4. Copy the ENTIRE contents of that file
5. Paste it into the Supabase SQL Editor
6. Click **"Run"** button (or press Ctrl+Enter / Cmd+Enter)
7. You should see a success message: "Success. No rows returned"

**What this does:**
- Creates the `users`, `cars`, and `fuel_entries` tables
- Sets up Row Level Security (RLS) to protect user data
- Creates indexes for fast queries
- Sets up automatic triggers for timestamps
- Configures automatic user profile creation on signup

---

## Part 4: Enable Email Authentication

### Step 5: Configure Authentication

1. In Supabase dashboard, click **"Authentication"** in the left sidebar
2. Click **"Providers"** tab
3. Find **"Email"** provider
4. Make sure it's **ENABLED** (toggle should be green)
5. Scroll down and configure these settings:
   - **Enable email confirmations**: Turn OFF (for easier testing)
   - **Enable email change confirmations**: Turn OFF (for easier testing)
   - **Secure email change**: Turn OFF (for easier testing)
6. Click **"Save"** button

**Note:** For production, you should enable email confirmations for security.

---

## Part 5: Get Your Environment Variables

### Step 6: Copy Your Supabase Credentials

1. In Supabase dashboard, click **"Settings"** (gear icon) in the left sidebar
2. Click **"API"** in the settings menu
3. You'll see these important values:

**Copy these values (you'll need them in the next step):**

- **Project URL**: Looks like `https://xxxxxxxxxxxxx.supabase.co`
- **anon public key**: Long string starting with `eyJ...`

### Step 7: Get Your Database URL

1. Still in **Settings**, click **"Database"** in the left menu
2. Scroll down to **"Connection string"** section
3. Select **"URI"** tab
4. Copy the connection string (looks like `postgresql://postgres:[YOUR-PASSWORD]@...`)
5. **IMPORTANT**: Replace `[YOUR-PASSWORD]` with the database password you created in Step 3

---
### Go from here Friday 31 3pm

## Part 6: Configure Your Local Project

### Step 8: Create Environment Variables File

1. Open your project folder in a code editor (VS Code, etc.)
2. Create a new file called `.env.local` in the root folder
3. Copy and paste this template:

\`\`\`env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Database Configuration (for direct SQL queries)
DATABASE_URL=your_database_url_here

# Optional: For development redirects
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000
\`\`\`

4. Replace the placeholder values:
   - Replace `your_project_url_here` with your **Project URL** from Step 6
   - Replace `your_anon_key_here` with your **anon public key** from Step 6
   - Replace `your_database_url_here` with your **Database URL** from Step 7

5. Save the file

**Example of what it should look like:**

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODk1MjM0NTYsImV4cCI6MjAwNTA5OTQ1Nn0.abc123xyz
DATABASE_URL=postgresql://postgres:YourStrongPassword123@db.abcdefghijk.supabase.co:5432/postgres
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000
\`\`\`

---

## Part 7: Install Dependencies and Run

### Step 9: Install Node Packages

1. Open a terminal in your project folder
2. Run this command:

\`\`\`bash
npm install
\`\`\`

3. Wait for all packages to install (may take 1-2 minutes)

### Step 10: Start the Development Server

1. In the same terminal, run:

\`\`\`bash
npm run dev
\`\`\`

2. You should see output like:

\`\`\`
▲ Next.js 15.x.x
- Local:        http://localhost:3000
- Ready in 2.3s
\`\`\`

3. Open your browser and go to: **http://localhost:3000**

---

## Part 8: Test Your Application

### Step 11: Create Your First Account

1. On the homepage, click **"Sign Up"** or **"Get Started"**
2. Enter your email and password
3. Click **"Sign Up"**
4. You should be logged in automatically

### Step 12: Add Your First Car

1. Click **"Add Car"** or **"Manage Cars"**
2. Fill in your car details:
   - Make (e.g., Toyota)
   - Model (e.g., Corolla)
   - Year (e.g., 2020)
   - Registration Number (e.g., ABC123GP)
3. Click **"Save"**

### Step 13: Add Your First Fuel Entry

1. Click **"Add Fuel Entry"** or **"New Entry"**
2. Fill in the details:
   - Date
   - Odometer reading
   - Liters
   - Price per liter
   - Petrol station (optional)
3. Click **"Save"**

**Congratulations!** Your Fuel Logbook app is now running!

---

## Troubleshooting

### Problem: "Authentication not configured" error

**Solution:**
- Check that your `.env.local` file exists and has the correct values
- Restart your development server (Ctrl+C, then `npm run dev` again)
- Make sure there are no extra spaces in your environment variables

### Problem: "Database connection failed" error

**Solution:**
- Check that your `DATABASE_URL` is correct
- Make sure you replaced `[YOUR-PASSWORD]` with your actual database password
- Verify the password doesn't have special characters that need URL encoding

### Problem: "Table does not exist" error

**Solution:**
- Go back to Step 4 and run the `FRESH_SUPABASE_SETUP.sql` script again
- Make sure the script ran successfully without errors

### Problem: Can't sign up or login

**Solution:**
- Check that Email authentication is enabled (Step 5)
- Check browser console for errors (F12 → Console tab)
- Verify your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct

### Problem: "Row Level Security" errors

**Solution:**
- The SQL script should have set up RLS correctly
- Try running the `FRESH_SUPABASE_SETUP.sql` script again
- Check Supabase logs: Dashboard → Logs → Database

---

## Next Steps

### Optional: Deploy to Production

Once everything works locally, you can deploy to Vercel:

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Add the same environment variables from `.env.local`
5. Deploy!

### Optional: Enable Email Confirmations

For production, enable email confirmations:

1. Supabase Dashboard → Authentication → Providers → Email
2. Enable **"Enable email confirmations"**
3. Configure your email templates in Authentication → Email Templates

---

## Summary of Files

**Files you need:**
- `FRESH_SUPABASE_SETUP.sql` - Run this in Supabase SQL Editor (ONE TIME ONLY)
- `.env.local` - Create this with your credentials (NEVER commit to Git)

**Files you can ignore:**
- `supabase-fresh-schema.sql` - OLD, don't use
- `scripts/` folder - OLD migration scripts, not needed for fresh setup

---

## Support

If you encounter issues:

1. Check the Troubleshooting section above
2. Check Supabase logs: Dashboard → Logs
3. Check browser console: F12 → Console tab
4. Verify all environment variables are correct

---

**You're all set!** Enjoy tracking your fuel consumption with your new Fuel Logbook app.
