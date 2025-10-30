# Fresh Deployment Guide

This guide walks you through deploying the Fuel Logbook app from scratch when you:
1. Download the ZIP folder from v0
2. Upload the project to GitHub
3. Deploy from a different/new Vercel account

---

## Part 1: Download and Prepare the Project

### Step 1: Download the ZIP

1. In v0, click the **three dots** (⋮) in the top right of the code block
2. Select **"Download ZIP"**
3. Save the file to your computer (e.g., `fuel-logbook-app.zip`)

### Step 2: Extract the Project

1. Extract the ZIP file to a folder on your computer
2. Open the extracted folder - you should see:
   \`\`\`
   fuel-logbook-app/
   ├── app/
   ├── components/
   ├── lib/
   ├── scripts/
   ├── public/
   ├── package.json
   ├── README.md
   ├── SUPABASE_FRESH_SETUP.md
   ├── AWS_S3_SETUP_INSTRUCTIONS.md
   ├── AWS_S3_RECEIPT_SETUP.md
   └── ... other files
   \`\`\`

### Step 3: Initialize Git (if not already initialized)

Open a terminal/command prompt in the project folder:

\`\`\`bash
# Navigate to the project folder
cd path/to/fuel-logbook-app

# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Fuel Logbook App"
\`\`\`

---

## Part 2: Upload to GitHub

### Step 1: Create a New GitHub Repository

1. Go to [github.com](https://github.com) and sign in
2. Click the **"+"** icon in the top right
3. Select **"New repository"**
4. Fill in the details:
   - **Repository name**: `fuel-logbook-app` (or your preferred name)
   - **Description**: "Fuel consumption tracking app with km/L calculations"
   - **Visibility**: Choose **Private** (recommended) or Public
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
5. Click **"Create repository"**

### Step 2: Push Your Code to GitHub

GitHub will show you commands to push an existing repository. Copy and run them:

\`\`\`bash
# Add GitHub as remote origin
git remote add origin https://github.com/YOUR-USERNAME/fuel-logbook-app.git

# Push to GitHub
git branch -M main
git push -u origin main
\`\`\`

Replace `YOUR-USERNAME` with your actual GitHub username.

**Verify:** Refresh your GitHub repository page - you should see all your files uploaded.

---

## Part 3: Deploy to Vercel

### Step 1: Sign Up / Sign In to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"** (or "Log In" if you have an account)
3. Choose **"Continue with GitHub"** (recommended for easy integration)
4. Authorize Vercel to access your GitHub account

### Step 2: Import Your Project

1. On the Vercel dashboard, click **"Add New..."** → **"Project"**
2. You'll see a list of your GitHub repositories
3. Find `fuel-logbook-app` and click **"Import"**

### Step 3: Configure Project Settings

Vercel will show the import configuration screen:

1. **Project Name**: Keep as `fuel-logbook-app` or customize
2. **Framework Preset**: Should auto-detect as **Next.js** ✓
3. **Root Directory**: Leave as `./` (default)
4. **Build Command**: Leave as default (`next build`)
5. **Output Directory**: Leave as default (`.next`)
6. **Install Command**: Leave as default (`npm install`)

**DO NOT click "Deploy" yet!** We need to set up integrations first.

---

## Part 4: Set Up Supabase Database

### Step 1: Create Supabase Account and Project

Follow the detailed instructions in **[SUPABASE_FRESH_SETUP.md](./SUPABASE_FRESH_SETUP.md)**

Quick summary:
1. Go to [supabase.com](https://supabase.com) and sign up
2. Create a new project: `fuel-logbook-db`
3. Choose region: **Europe (Frankfurt)** or **Europe (London)** for South Africa
4. Copy your project URL and API keys

### Step 2: Connect Supabase to Vercel

**Option A: Automatic Integration (Recommended)**

1. In your Vercel project configuration screen, scroll down
2. Look for **"Add Integration"** or go to project **Settings** → **Integrations**
3. Search for **"Supabase"**
4. Click **"Add Integration"**
5. Authorize and select your Supabase project
6. Vercel will automatically add all database environment variables ✓

**Option B: Manual Setup**

1. In Vercel project settings, go to **Environment Variables**
2. Add these variables:
   - `NEXT_PUBLIC_SUPABASE_URL` = Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Your Supabase anonymous key
   - `SUPABASE_SERVICE_ROLE_KEY` = Your Supabase service role key
3. Select all environments (Production, Preview, Development)
4. Click **"Save"**

### Step 3: Create Database Schema

You have two options:

**Option A: Using Supabase SQL Editor (Easiest)**

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project
3. Click **"SQL Editor"**
4. Open the file `supabase-fresh-schema.sql` from your downloaded project
5. Copy the entire SQL content
6. Paste into Supabase SQL Editor
7. Click **"Run"** (or press Ctrl+Enter)
8. You should see: `Success. No rows returned` message ✓

**Option B: After First Deployment**

1. Deploy the app first (see Part 5)
2. The app can run migrations automatically
3. Or use the Vercel CLI to run scripts

---

## Part 5: Set Up AWS S3 for Receipt Storage

### Step 1: Create S3 Bucket and Configure Access

Follow the detailed instructions in **[AWS_S3_RECEIPT_SETUP.md](./AWS_S3_RECEIPT_SETUP.md)**

Quick summary:

1. Create an S3 bucket in AWS Console
2. Configure bucket for public read access (for receipt images)
3. Create IAM user with S3 permissions
4. Generate access keys
5. Add AWS credentials to Vercel environment variables:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `AWS_REGION`
   - `AWS_S3_BUCKET_NAME`

---

## Part 6: Deploy Your Application

### Step 1: Deploy

Now that integrations are set up:

1. Go back to your Vercel project
2. Click the **"Deploy"** button
3. Vercel will:
   - Install dependencies
   - Build your Next.js app
   - Deploy to production
4. Wait for deployment to complete (usually 1-2 minutes)

### Step 2: Verify Deployment

1. Once deployed, click **"Visit"** to open your app
2. You should see the Fuel Logbook interface
3. Try adding a test fuel entry to verify everything works

---

## Part 7: Local Development Setup

### Step 1: Install Dependencies

\`\`\`bash
cd fuel-logbook-app
npm install
\`\`\`

### Step 2: Pull Environment Variables

\`\`\`bash
# Install Vercel CLI
npm install -g vercel

# Link to your Vercel project
vercel link

# Pull environment variables
vercel env pull .env.local
\`\`\`

This creates `.env.local` with all your environment variables from Vercel.

### Step 3: Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Part 8: Verification Checklist

Before using the app in production, verify:

- [ ] App is deployed and accessible via Vercel URL
- [ ] Supabase database is connected (check Vercel → Settings → Environment Variables)
- [ ] Database tables exist (check Supabase SQL Editor)
- [ ] AWS S3 bucket is configured with proper permissions
- [ ] AWS credentials are set in Vercel environment variables
- [ ] Can add a fuel entry successfully
- [ ] Can upload a receipt image (stored in S3)
- [ ] Can view fuel entries in dashboard
- [ ] Can delete a fuel entry (removes receipt from S3)
- [ ] Can export logbook (HTML download works)
- [ ] S3 JSON export works

---

## Part 9: Troubleshooting Common Issues

### Issue: "Database connection failed"

**Solutions:**
1. Check Vercel → Settings → Environment Variables
2. Verify Supabase environment variables are set correctly
3. Test connection in Supabase Dashboard
4. Redeploy the app after adding variables

### Issue: "Table does not exist"

**Solutions:**
1. Run the SQL migration script in Supabase SQL Editor
2. Copy content from `supabase-fresh-schema.sql`
3. Paste and run in Supabase Dashboard → SQL Editor

### Issue: "Receipt upload failed"

**Solutions:**
1. Verify AWS S3 bucket exists and is configured
2. Check all AWS environment variables are set correctly
3. Verify bucket permissions allow public read access
4. Check IAM user has proper S3 permissions
5. Redeploy the app after adding AWS variables

### Issue: "Environment variables not found locally"

**Solutions:**
1. Run `vercel link` to link your local project
2. Run `vercel env pull .env.local` to download variables
3. Restart your development server (`npm run dev`)

### Issue: Build fails on Vercel

**Solutions:**
1. Check the build logs in Vercel dashboard
2. Ensure `package.json` has all required dependencies
3. Verify Next.js version compatibility
4. Try redeploying

---

## Part 10: Updating Your App

### Making Changes

1. Edit files locally
2. Test changes: `npm run dev`
3. Commit changes:
   \`\`\`bash
   git add .
   git commit -m "Description of changes"
   \`\`\`
4. Push to GitHub:
   \`\`\`bash
   git push origin main
   \`\`\`
5. Vercel automatically deploys the changes ✓

### Adding New Environment Variables

1. Add in Vercel → Settings → Environment Variables
2. Pull locally: `vercel env pull .env.local`
3. Restart dev server

---

## Part 11: Cost Summary (Free Tier)

Your app runs on free and low-cost tiers:

| Service | Free Tier | Sufficient For |
|---------|-----------|----------------|
| **Vercel** | Unlimited deployments, 100 GB bandwidth | Personal use, small teams |
| **Supabase** | 500 MB database, 2 GB bandwidth, 50 MB file storage | Thousands of fuel entries |
| **AWS S3** | 5 GB storage, 20,000 GET requests (first year) | Hundreds of receipt images |

**Estimated monthly cost after first year: ~R10-50** (depending on S3 usage)

### Backups

- [ ] Regularly export data to S3 (JSON backups)
- [ ] Download HTML exports periodically
- [ ] Supabase automatically backs up your database
- [ ] S3 receipts are automatically backed up by AWS

### Monitoring

- [ ] Check Vercel Analytics for usage
- [ ] Monitor Supabase database usage (free tier: 500 MB)
- [ ] Monitor S3 storage usage and costs

---

## Part 12: Production Best Practices

### Security

- [ ] Never commit `.env.local` to GitHub
- [ ] Use environment variables for all secrets
- [ ] Keep dependencies updated: `npm update`
- [ ] Enable Vercel's security headers (automatic)
- [ ] Review S3 bucket permissions regularly

### Backups

- [ ] Regularly export data to S3 (JSON backups)
- [ ] Download HTML exports periodically
- [ ] Supabase automatically backs up your database
- [ ] S3 receipts are automatically backed up by AWS

### Monitoring

- [ ] Check Vercel Analytics for usage
- [ ] Monitor Supabase database usage (free tier: 500 MB)
- [ ] Monitor S3 storage usage and costs

---

## Part 13: Getting Help

### Documentation

- **This Project**: See [README.md](./README.md)
- **Supabase Setup**: [SUPABASE_FRESH_SETUP.md](./SUPABASE_FRESH_SETUP.md)
- **AWS S3 Receipt Setup**: [AWS_S3_RECEIPT_SETUP.md](./AWS_S3_RECEIPT_SETUP.md)
- **AWS S3 Export Setup**: [AWS_S3_SETUP_INSTRUCTIONS.md](./AWS_S3_SETUP_INSTRUCTIONS.md)

### External Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)

### Support

- **Vercel**: [vercel.com/help](https://vercel.com/help)
- **Supabase**: [Discord Community](https://discord.com/invite/supabase)
- **GitHub Issues**: Create an issue in your repository

---

## Quick Start Summary

For experienced developers, here's the TL;DR:

\`\`\`bash
# 1. Download ZIP from v0, extract, and push to GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR-USERNAME/fuel-logbook-app.git
git push -u origin main

# 2. Deploy to Vercel
# - Import from GitHub at vercel.com
# - Add Supabase integration (auto-adds environment variables)
# - Add AWS S3 credentials manually

# 3. Create database schema
# - Go to supabase.com/dashboard → SQL Editor
# - Run supabase-fresh-schema.sql

# 4. Configure S3 bucket
# - Create bucket with proper permissions
# - Add AWS credentials to Vercel

# 5. Local development
npm install
vercel link
vercel env pull .env.local
npm run dev
\`\`\`

---

## Congratulations! 🎉

Your Fuel Logbook app is now deployed and ready to track your vehicle's fuel consumption, calculate km/L, store receipts in S3, and help with SARS tax compliance!

**Next Steps:**
1. Add your first fuel entry
2. Upload a receipt (stored in AWS S3)
3. Track your consumption over time
4. Export data for tax purposes

Happy tracking! 🚗⛽
