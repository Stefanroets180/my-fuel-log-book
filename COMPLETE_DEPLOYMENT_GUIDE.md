# Complete Deployment Guide - Fuel Logbook App

This is the master guide for deploying your Fuel Logbook app with multi-user authentication support. Follow these steps in order for a successful deployment.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start (New Deployment)](#quick-start-new-deployment)
3. [Detailed Setup Steps](#detailed-setup-steps)
4. [Environment Variables Reference](#environment-variables-reference)
5. [Troubleshooting](#troubleshooting)
6. [Post-Deployment Checklist](#post-deployment-checklist)

---

## Prerequisites

Before you begin, make sure you have:

- [ ] A GitHub account
- [ ] A Vercel account (sign up at https://vercel.com)
- [ ] A Supabase account (sign up at https://supabase.com)
- [ ] An AWS account with S3 access (for receipt storage)
- [ ] Node.js 22.14.0 or higher installed locally (for testing)

---

## Quick Start (New Deployment)

For a brand new deployment with no existing data:

### Step 1: Fork/Clone Repository

1. Push your code to a new GitHub repository
2. Make sure all files are committed

### Step 2: Deploy to Vercel

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: ./
   - **Node Version**: 22.x
4. Click "Deploy" (it will fail initially - this is expected)

### Step 3: Set Up Supabase

Follow the complete guide in: **`SUPABASE_AUTHENTICATION_SETUP.md`**

Key steps:
1. Create Supabase project
2. Get your credentials (URL and anon key)
3. Run the database schema script
4. Configure auth settings

### Step 4: Set Up AWS S3

Follow the complete guide in: **`AWS_S3_RECEIPT_SETUP.md`**

Key steps:
1. Create S3 bucket
2. Configure CORS
3. Create IAM user with S3 access
4. Get access keys

### Step 5: Configure Environment Variables

In Vercel Dashboard → Settings → Environment Variables, add:

\`\`\`
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback

# AWS S3
AWS_REGION=your_aws_region
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_S3_BUCKET_NAME=your_bucket_name
\`\`\`

### Step 6: Install Supabase Packages

Follow: **`INSTALL_SUPABASE_PACKAGES.md`**

\`\`\`bash
npm install @supabase/supabase-js @supabase/ssr
git add package.json package-lock.json
git commit -m "Add Supabase dependencies"
git push
\`\`\`

### Step 7: Uncomment Authentication Code

Uncomment the code in these files (remove `/*` and `*/`):

- [ ] `lib/supabase/client.ts`
- [ ] `lib/supabase/server.ts`
- [ ] `lib/supabase/middleware.ts`
- [ ] `middleware.ts`
- [ ] `app/auth/login/page.tsx`
- [ ] `app/auth/signup/page.tsx`
- [ ] `app/auth/callback/route.ts`
- [ ] `app/auth/logout/route.ts`
- [ ] `components/auth/login-form.tsx`
- [ ] `components/auth/signup-form.tsx`
- [ ] `components/user-nav.tsx`
- [ ] `app/api/cars/route.ts`
- [ ] `app/api/cars/[id]/route.ts`
- [ ] `components/car-management-dialog.tsx`

### Step 8: Deploy

\`\`\`bash
git add .
git commit -m "Enable Supabase authentication"
git push
\`\`\`

Vercel will automatically redeploy.

### Step 9: Test

1. Visit your deployed app
2. Sign up for an account
3. Check your email for verification
4. Log in
5. Add a car
6. Create a fuel entry
7. Upload a receipt

---

## Detailed Setup Steps

### 1. GitHub Repository Setup

\`\`\`bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Fuel Logbook App"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
\`\`\`

### 2. Vercel Deployment

#### Option A: Vercel Dashboard

1. Go to https://vercel.com/new
2. Click "Import Project"
3. Select your GitHub repository
4. Configure:
   - **Project Name**: fuel-logbook (or your choice)
   - **Framework**: Next.js
   - **Root Directory**: ./
   - **Build Command**: `npm run build`
   - **Output Directory**: .next
   - **Install Command**: `npm install`
5. Click "Deploy"

#### Option B: Vercel CLI

\`\`\`bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Follow the prompts
\`\`\`

### 3. Supabase Setup

See **`SUPABASE_AUTHENTICATION_SETUP.md`** for complete instructions.

**Quick Reference:**

1. Create project at https://supabase.com
2. Go to Settings → API
3. Copy:
   - Project URL
   - anon/public key
4. Go to SQL Editor
5. Run `scripts/supabase-schema.sql`
6. Go to Authentication → URL Configuration
7. Add your Vercel URL as redirect URL

### 4. AWS S3 Setup

See **`AWS_S3_RECEIPT_SETUP.md`** for complete instructions.

**Quick Reference:**

1. Create S3 bucket
2. Enable public read access (for receipts)
3. Configure CORS:

\`\`\`json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": []
  }
]
\`\`\`

4. Create IAM user with S3 permissions
5. Generate access keys

### 5. Environment Variables

Add these in Vercel Dashboard → Settings → Environment Variables:

#### Supabase Variables

| Variable | Value | Environment |
|----------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | All |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key | All |
| `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` | `http://localhost:3000/auth/callback` | Development |

#### AWS S3 Variables

| Variable | Value | Environment |
|----------|-------|-------------|
| `AWS_REGION` | e.g., `us-east-1` | All |
| `AWS_ACCESS_KEY_ID` | Your AWS access key | All |
| `AWS_SECRET_ACCESS_KEY` | Your AWS secret key | All |
| `AWS_S3_BUCKET_NAME` | Your bucket name | All |

**Important**: 
- Add variables to ALL environments (Production, Preview, Development)
- Never commit these values to Git
- Keep your secret keys secure

### 6. Local Development Setup

\`\`\`bash
# Clone your repository
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME

# Install dependencies
npm install

# Create .env.local file
touch .env.local

# Add your environment variables to .env.local
# (Copy from Vercel or use your own values)

# Run development server
npm run dev

# Open http://localhost:3000
\`\`\`

**`.env.local` example:**

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback

AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_S3_BUCKET_NAME=your-bucket-name
\`\`\`

### 7. Database Migration (If You Have Existing Data)

See **`DATABASE_MIGRATION_GUIDE.md`** for complete instructions.

**Quick steps:**

1. Backup existing data from Neon
2. Set up Supabase
3. Create your first user account
4. Run migration script with your user UUID
5. Verify data was migrated correctly

### 8. Enabling Authentication

After Supabase is set up and packages are installed:

1. Uncomment all authentication code (see Step 7 in Quick Start)
2. Test locally first:
   \`\`\`bash
   npm run dev
   \`\`\`
3. Visit http://localhost:3000
4. You should be redirected to login
5. Sign up for a test account
6. Verify everything works
7. Commit and push:
   \`\`\`bash
   git add .
   git commit -m "Enable authentication"
   git push
   \`\`\`

---

## Environment Variables Reference

### Required Variables

These MUST be set for the app to work:

\`\`\`bash
# Supabase (for authentication and database)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...

# AWS S3 (for receipt storage)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=xxx...
AWS_S3_BUCKET_NAME=fuel-logbook-receipts
\`\`\`

### Optional Variables

\`\`\`bash
# Development only - for local Supabase redirects
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback

# Analytics (if using Vercel Analytics)
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=xxx
\`\`\`

### How to Add Variables in Vercel

1. Go to your project in Vercel Dashboard
2. Click "Settings"
3. Click "Environment Variables"
4. For each variable:
   - Enter the **Key** (e.g., `AWS_REGION`)
   - Enter the **Value** (e.g., `us-east-1`)
   - Select environments: Production, Preview, Development
   - Click "Save"
5. After adding all variables, redeploy:
   - Go to "Deployments"
   - Click "..." on the latest deployment
   - Click "Redeploy"

---

## Troubleshooting

### Deployment Fails

**Issue**: Build fails with "Module not found"

**Solution**:
1. Check that all dependencies are in `package.json`
2. Run `npm install` locally to verify
3. Check for typos in import statements
4. Ensure Node version is 22.x or higher

**Issue**: "Environment variable not found"

**Solution**:
1. Verify all required env vars are set in Vercel
2. Check spelling and capitalization
3. Redeploy after adding variables

### Authentication Issues

**Issue**: Redirected to login but can't sign up

**Solution**:
1. Check Supabase environment variables are correct
2. Verify Supabase project is active
3. Check browser console for errors
4. Ensure redirect URLs are configured in Supabase

**Issue**: "Invalid API key" error

**Solution**:
1. Verify you're using the **anon key**, not the service role key
2. Check for extra spaces in the environment variable
3. Regenerate the key in Supabase if needed

### Receipt Upload Issues

**Issue**: Receipts fail to upload

**Solution**:
1. Check AWS credentials are correct
2. Verify S3 bucket exists and is accessible
3. Check CORS configuration on S3 bucket
4. Verify IAM user has S3 permissions

**Issue**: Receipts upload but don't display

**Solution**:
1. Check S3 bucket has public read access
2. Verify the URL format is correct
3. Check browser console for CORS errors

### Database Issues

**Issue**: "relation does not exist" error

**Solution**:
1. Run the database schema script in Supabase SQL Editor
2. Verify tables were created successfully
3. Check table names match the code

**Issue**: Can see other users' data

**Solution**:
1. Verify Row Level Security (RLS) is enabled
2. Check RLS policies are created
3. Re-run the schema script if policies are missing

---

## Post-Deployment Checklist

After deployment, verify these items:

### Functionality Tests

- [ ] App loads without errors
- [ ] Can sign up for a new account
- [ ] Receive verification email
- [ ] Can log in after verification
- [ ] Can add a car
- [ ] Can create a fuel entry
- [ ] Can upload a receipt
- [ ] Receipt displays correctly
- [ ] Can edit a fuel entry
- [ ] Can delete a fuel entry
- [ ] Can log out
- [ ] Cannot access app when logged out (redirects to login)

### Security Tests

- [ ] Create two user accounts
- [ ] Verify User A cannot see User B's data
- [ ] Verify User B cannot see User A's data
- [ ] Check that API endpoints require authentication
- [ ] Verify receipts are stored securely in S3

### Performance Tests

- [ ] App loads quickly (< 3 seconds)
- [ ] Images load properly
- [ ] No console errors
- [ ] Mobile responsive design works
- [ ] Works in different browsers (Chrome, Firefox, Safari)

### Configuration Verification

- [ ] All environment variables are set
- [ ] Supabase project is active
- [ ] S3 bucket is configured correctly
- [ ] Domain is set up (if using custom domain)
- [ ] SSL certificate is active (https://)

---

## Maintenance

### Regular Tasks

**Weekly:**
- Check Supabase dashboard for any auth issues
- Monitor S3 storage usage
- Review Vercel deployment logs

**Monthly:**
- Update dependencies: `npm update`
- Check for security vulnerabilities: `npm audit`
- Review and clean up old receipts in S3 (if needed)
- Backup database (Supabase has automatic backups)

**As Needed:**
- Rotate AWS access keys (every 90 days recommended)
- Update Supabase if new features are needed
- Scale S3 storage if running low

### Updating the App

\`\`\`bash
# Make changes locally
git add .
git commit -m "Description of changes"
git push

# Vercel will automatically deploy
# Check deployment status in Vercel Dashboard
\`\`\`

### Rolling Back

If a deployment breaks something:

1. Go to Vercel Dashboard → Deployments
2. Find the last working deployment
3. Click "..." → "Promote to Production"

---

## Support Resources

- **Supabase Docs**: https://supabase.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Vercel Docs**: https://vercel.com/docs
- **AWS S3 Docs**: https://docs.aws.amazon.com/s3/

## Project Documentation

- `SUPABASE_AUTHENTICATION_SETUP.md` - Complete Supabase setup
- `AWS_S3_RECEIPT_SETUP.md` - S3 configuration
- `DATABASE_MIGRATION_GUIDE.md` - Migrating existing data
- `CAR_MANAGEMENT_GUIDE.md` - Using the car management feature
- `NEON_TO_SUPABASE_MIGRATION.md` - Migrating from Neon to Supabase

---

## Success!

If you've completed all steps and passed the post-deployment checklist, congratulations! Your Fuel Logbook app is now live with multi-user authentication support.

**Next Steps:**
1. Share the app with friends/family for testing
2. Gather feedback
3. Add new features as needed
4. Enjoy tracking your fuel expenses!
