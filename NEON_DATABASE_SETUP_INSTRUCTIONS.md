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
- `NEON_DATABASE_URL` (pooled connection)
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

# AWS S3 Credentials (for receipt storage)
AWS_ACCESS_KEY_ID="your_access_key"
AWS_SECRET_ACCESS_KEY="your_secret_key"
AWS_REGION="us-east-1"
AWS_S3_BUCKET_NAME="your-bucket-name"
\`\`\`

Replace the bracketed values with your actual credentials.

⚠️ **Important:** Add `.env.local` to your `.gitignore` to prevent committing secrets!

---
