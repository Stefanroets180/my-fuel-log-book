# Troubleshooting Neon Database Connection

## Error: "No database connection string was provided to `neon()`"

This error occurs when the Neon database environment variable is not properly configured.

---

## Quick Fix Steps

### Step 1: Verify Environment Variables in Vercel

1. **Go to your Vercel Dashboard**
   - Navigate to: https://vercel.com/dashboard

2. **Select your project**
   - Click on your fuel logbook app project

3. **Go to Settings → Environment Variables**
   - In the left sidebar, click **Settings**
   - Click **Environment Variables** tab

4. **Check for Neon variables**
   - Look for these variables (you need at least one):
     - `NEON_NEON_DATABASE_URL` ✅ (This is what the app uses)
     - `NEON_POSTGRES_URL`
     - `NEON_POSTGRES_PRISMA_URL`

5. **If missing, add the Neon Integration**
   - Go to **Integrations** in your project settings
   - Search for "Neon"
   - Click **Add Integration**
   - Follow the prompts to connect your Neon database
   - This will automatically add all required environment variables

### Step 2: Verify Environment Variables Locally (for local development)

If you're running the app locally with `npm run dev`:

1. **Create a `.env.local` file** in your project root (if it doesn't exist)

2. **Add your Neon connection string:**
   \`\`\`env
   NEON_DATABASE_URL=postgresql://[user]:[password]@[host]/[database]?sslmode=require
   \`\`\`

3. **Get your connection string from Neon Console:**
   - Go to https://console.neon.tech
   - Select your project
   - Click **Dashboard** in the sidebar
   - Look for **Connection Details** section
   - Copy the connection string (it starts with `postgresql://`)
   - Make sure to select the **Pooled connection** option

4. **Restart your development server:**
   \`\`\`bash
   # Stop the server (Ctrl+C)
   # Start it again
   npm run dev
   \`\`\`

---

## Step 3: Verify the Database Table Exists

Even with the connection working, you need to create the `fuel_entries` table:

1. **Go to Neon Console:** https://console.neon.tech

2. **Select your project**

3. **Open SQL Editor:**
   - Click **SQL Editor** in the left sidebar

4. **Run the migration script:**
   - Copy the contents of `scripts/001_create_fuel_entries_table.sql`
   - Paste into the SQL Editor
   - Click **Run** button

5. **Verify the table was created:**
   \`\`\`sql
   SELECT * FROM fuel_entries;
   \`\`\`
   - This should return an empty result (no rows) but no error

---

## Common Issues and Solutions

### Issue 1: "relation 'fuel_entries' does not exist"
**Solution:** You haven't run the migration script yet. Follow Step 3 above.

### Issue 2: Environment variables not updating in Vercel
**Solution:** 
- After adding/changing environment variables in Vercel, you must **redeploy** your app
- Go to **Deployments** tab
- Click the three dots (...) on the latest deployment
- Click **Redeploy**

### Issue 3: Works in Vercel but not locally
**Solution:** 
- Make sure you have `.env.local` file with `NEON_DATABASE_URL`
- The `.env.local` file is gitignored, so it won't be in your downloaded ZIP
- You must create it manually for local development

### Issue 4: "password authentication failed"
**Solution:**
- Your connection string might be incorrect
- Go to Neon Console → Dashboard → Connection Details
- Copy a fresh connection string
- Make sure you're using the **Pooled connection** string
- Update your environment variable with the new string

---

## Verification Checklist

Before the app will work, verify:

- [ ] Neon integration is connected in Vercel (or `.env.local` exists locally)
- [ ] `NEON_DATABASE_URL` environment variable is set
- [ ] The `fuel_entries` table has been created (run the SQL migration)
- [ ] If on Vercel, you've redeployed after adding environment variables
- [ ] If local, you've restarted the dev server after creating `.env.local`

---

## Getting Your Neon Connection String

### From Neon Console:

1. Go to https://console.neon.tech
2. Select your project
3. Click **Dashboard** in the sidebar
4. Find **Connection Details** section
5. Select **Pooled connection** from the dropdown
6. Click the **Copy** button next to the connection string

The connection string format:
\`\`\`
postgresql://[username]:[password]@[host]/[database]?sslmode=require
\`\`\`

### From Vercel Integration:

If you connected Neon through Vercel's integration marketplace, the environment variables are automatically set. You just need to:

1. Redeploy your app after adding the integration
2. For local development, manually add the connection string to `.env.local`

---

## Still Having Issues?

1. **Check the browser console** for detailed error messages
2. **Check Vercel deployment logs** for server-side errors
3. **Verify your Neon database is active** (not paused due to inactivity on free tier)
4. **Test the connection string** using a tool like `psql` or a database client

### Test Connection with psql (if installed):
\`\`\`bash
psql "postgresql://[your-connection-string]"
\`\`\`

If this connects successfully, the issue is with your app configuration, not Neon.

---

## Need More Help?

- **Neon Documentation:** https://neon.tech/docs
- **Vercel Environment Variables:** https://vercel.com/docs/environment-variables
- **Next.js Environment Variables:** https://nextjs.org/docs/app/building-your-application/configuring/environment-variables
