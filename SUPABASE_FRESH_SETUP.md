# Supabase Fresh Setup Guide

This guide walks you through setting up a brand new Supabase database for your Fuel Logbook app from scratch.

## Prerequisites

- A Supabase account (sign up at https://supabase.com)
- Your Fuel Logbook app code
- Basic understanding of SQL

---

## Step 1: Create a New Supabase Project

1. **Log in to Supabase Dashboard**
   - Go to https://app.supabase.com
   - Sign in with your account

2. **Create New Project**
   - Click "New Project"
   - Fill in the details:
     - **Name**: `fuel-logbook` (or your preferred name)
     - **Database Password**: Create a strong password (save this!)
     - **Region**: Choose the closest region to your users
     - **Pricing Plan**: Free tier is fine for getting started
   - Click "Create new project"
   - Wait 2-3 minutes for the project to be provisioned

---

## Step 2: Run the Database Schema

1. **Open SQL Editor**
   - In your Supabase project dashboard
   - Click "SQL Editor" in the left sidebar
   - Click "New query"

2. **Copy and Paste Schema**
   - Open the `supabase-fresh-schema.sql` file from your project
   - Copy the entire contents
   - Paste into the SQL Editor

3. **Execute the Schema**
   - Click "Run" or press `Ctrl+Enter` (Windows/Linux) or `Cmd+Enter` (Mac)
   - You should see "Success. No rows returned" message
   - This creates all tables, indexes, RLS policies, and triggers

4. **Verify Tables Created**
   - Click "Table Editor" in the left sidebar
   - You should see three tables:
     - `users`
     - `cars`
     - `fuel_entries`

---

## Step 3: Configure Authentication

1. **Enable Email Authentication**
   - Click "Authentication" in the left sidebar
   - Click "Providers"
   - Find "Email" provider
   - Toggle it ON if not already enabled
   - Configure settings:
     - **Enable email confirmations**: ON (recommended)
     - **Enable email change confirmations**: ON (recommended)
     - **Secure email change**: ON (recommended)
   - Click "Save"

2. **Configure Email Templates (Optional)**
   - Click "Email Templates" under Authentication
   - Customize the confirmation and password reset emails
   - Add your app name and branding

3. **Configure Site URL**
   - Click "URL Configuration" under Authentication
   - Set **Site URL** to your app URL:
     - For local development: `http://localhost:3000`
     - For production: `https://your-app.vercel.app`
   - Add **Redirect URLs**:
     - `http://localhost:3000/auth/callback` (for development)
     - `https://your-app.vercel.app/auth/callback` (for production)
   - Click "Save"

---

## Step 4: Get Your API Keys

1. **Navigate to Project Settings**
   - Click the gear icon (Settings) in the left sidebar
   - Click "API" under Project Settings

2. **Copy Your Credentials**
   You'll need these values:
   
   - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
   - **anon/public key**: `eyJhbGc...` (long string)
   - **service_role key**: `eyJhbGc...` (different long string - keep this secret!)

3. **Important Notes**
   - The `anon` key is safe to use in your frontend
   - The `service_role` key should ONLY be used on the server
   - Never commit these keys to public repositories

---

## Step 5: Configure Environment Variables

1. **Create/Update `.env.local` File**
   In your project root, create or update `.env.local`:

   \`\`\`env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your-anon-key...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...your-service-role-key...
   
   # For development email redirects
   NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback
   
   # Your existing AWS S3 configuration
   AWS_ACCESS_KEY_ID=your-access-key
   AWS_SECRET_ACCESS_KEY=your-secret-key
   AWS_REGION=your-region
   AWS_S3_BUCKET_NAME=fuel-logbook-receipts
   
   # Your existing Neon database (if keeping it)
   DATABASE_URL=postgresql://...
   \`\`\`

2. **Add to Vercel (for Production)**
   - Go to your Vercel project dashboard
   - Click "Settings" → "Environment Variables"
   - Add each variable:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY`
   - Set environment: Production, Preview, Development (as needed)
   - Click "Save"

---

## Step 6: Install Supabase Packages

1. **Uncomment Package Dependencies**
   Open `package.json` and uncomment these lines:
   \`\`\`json
   "@supabase/ssr": "^0.5.2",
   "@supabase/supabase-js": "^2.45.4",
   \`\`\`

2. **Install Dependencies**
   \`\`\`bash
   npm install
   \`\`\`

---

## Step 7: Uncomment Authentication Code

Follow the instructions in `SUPABASE_AUTHENTICATION_SETUP.md` to uncomment the authentication code in your app.

**Key files to uncomment:**
- `lib/supabase/client.ts`
- `lib/supabase/server.ts`
- `lib/supabase/middleware.ts`
- `middleware.ts`
- `app/auth/login/page.tsx`
- `app/auth/signup/page.tsx`
- `components/auth/login-form.tsx`
- `components/auth/signup-form.tsx`
- `components/auth/user-nav.tsx`

---

## Step 8: Test Your Setup

1. **Start Development Server**
   \`\`\`bash
   npm run dev
   \`\`\`

2. **Test User Registration**
   - Navigate to `http://localhost:3000/auth/signup`
   - Create a test account
   - Check your email for confirmation link
   - Click the confirmation link

3. **Test Login**
   - Navigate to `http://localhost:3000/auth/login`
   - Log in with your test account
   - You should be redirected to the dashboard

4. **Verify Database**
   - Go back to Supabase Dashboard
   - Click "Table Editor" → "users"
   - You should see your test user in the table

5. **Test Fuel Entry Creation**
   - Create a fuel entry in your app
   - Check "Table Editor" → "fuel_entries"
   - Verify the entry was created with your user_id

---

## Step 9: Verify Row Level Security (RLS)

1. **Test RLS Policies**
   - Create a second test user
   - Log in as the second user
   - Verify you can only see your own fuel entries
   - Verify you cannot see the first user's entries

2. **Check RLS Status**
   - In Supabase Dashboard, go to "Table Editor"
   - Click on each table (users, cars, fuel_entries)
   - Verify "RLS enabled" shows as ON
   - Click "View policies" to see active policies

---

## Step 10: Production Deployment

1. **Update Vercel Environment Variables**
   - Ensure all Supabase variables are set in Vercel
   - Update `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` to your production URL

2. **Update Supabase Redirect URLs**
   - In Supabase Dashboard → Authentication → URL Configuration
   - Add your production URL to redirect URLs
   - Example: `https://your-app.vercel.app/auth/callback`

3. **Deploy to Vercel**
   \`\`\`bash
   git add .
   git commit -m "Add Supabase authentication"
   git push
   \`\`\`

4. **Test Production**
   - Visit your production URL
   - Test signup, login, and fuel entry creation
   - Verify everything works as expected

---

## Troubleshooting

### Issue: "Invalid API key" error

**Solution:**
- Double-check your environment variables
- Ensure you're using the `anon` key for `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Restart your development server after changing `.env.local`

### Issue: Email confirmation not working

**Solution:**
- Check Supabase Dashboard → Authentication → Email Templates
- Verify your Site URL is correct
- Check spam folder for confirmation emails
- For development, you can disable email confirmation temporarily

### Issue: "Row Level Security policy violation"

**Solution:**
- Verify RLS policies are created (check SQL Editor output)
- Ensure user is properly authenticated
- Check that `user_id` matches `auth.uid()` in your queries

### Issue: Cannot see other users' data (this is correct!)

**Solution:**
- This is expected behavior due to RLS policies
- Each user can only see their own data
- This is a security feature, not a bug

### Issue: "relation 'auth.users' does not exist"

**Solution:**
- This shouldn't happen in Supabase (auth schema exists by default)
- If it does, contact Supabase support
- Verify you're running the schema in the correct project

---

## Next Steps

- **Add Cars**: Use the car management feature to add your vehicles
- **Import Existing Data**: If you have data in Neon, see `NEON_TO_SUPABASE_MIGRATION.md`
- **Customize**: Adjust the schema or add features as needed
- **Monitor**: Use Supabase Dashboard to monitor usage and performance

---

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)

---

## Support

If you encounter issues:
1. Check the Troubleshooting section above
2. Review Supabase logs in the Dashboard
3. Check browser console for errors
4. Verify all environment variables are set correctly
5. Ensure you've uncommented all necessary code files

Your Supabase database is now ready for production use! 🚀
