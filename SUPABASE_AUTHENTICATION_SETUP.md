# Supabase Authentication Setup Guide

This guide will walk you through setting up Supabase authentication for the Fuel Logbook app, enabling multi-user support with secure login functionality.

## Overview

This setup will enable:
- User registration and login with email/password
- Secure authentication using Supabase Auth
- Multi-user support with isolated data per user
- Multiple cars per user
- Protected routes that require authentication

## Prerequisites

- A Supabase account (sign up at https://supabase.com)
- Your Fuel Logbook app deployed or running locally
- Access to your Vercel project settings (for environment variables)

---

## Step 1: Create a Supabase Project

1. Go to https://supabase.com and sign in
2. Click "New Project"
3. Fill in the project details:
   - **Name**: `fuel-logbook` (or your preferred name)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose the region closest to your users
4. Click "Create new project"
5. Wait for the project to be provisioned (takes 1-2 minutes)

---

## Step 2: Get Your Supabase Credentials

1. In your Supabase project dashboard, click on the **Settings** icon (gear icon) in the left sidebar
2. Click on **API** in the settings menu
3. You'll see two important values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (under "Project API keys")
4. Copy these values - you'll need them in the next step

---

## Step 3: Add Environment Variables to Vercel

### Option A: Through Vercel Dashboard

1. Go to your Vercel project dashboard
2. Click on **Settings** tab
3. Click on **Environment Variables** in the left sidebar
4. Add the following environment variables:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback
\`\`\`

5. Make sure to add them for all environments (Production, Preview, Development)
6. Click **Save**

### Option B: Through Vercel CLI

If you prefer using the CLI:

\`\`\`bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
# Paste your Supabase URL when prompted

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# Paste your anon key when prompted

vercel env add NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL
# Enter: http://localhost:3000/auth/callback
\`\`\`

---

## Step 4: Configure Supabase Auth Settings

1. In your Supabase dashboard, go to **Authentication** → **URL Configuration**
2. Add your site URL:
   - **Site URL**: `https://your-app.vercel.app` (your production URL)
3. Add redirect URLs:
   - `https://your-app.vercel.app/auth/callback`
   - `http://localhost:3000/auth/callback` (for local development)
4. Click **Save**

---

## Step 5: Set Up Database Tables for Multi-User Support

1. In your Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy and paste the SQL from `scripts/supabase-schema.sql` (this file is in your project)
4. Click **Run** to execute the query
5. This will create:
   - `users` table (linked to Supabase auth)
   - `cars` table (multiple cars per user)
   - Updated `fuel_entries` table (linked to users and cars)
   - Row Level Security (RLS) policies for data isolation

---

## Step 6: Enable Row Level Security (RLS)

Row Level Security ensures users can only see their own data.

1. In Supabase dashboard, go to **Authentication** → **Policies**
2. Verify that RLS is enabled for:
   - `users` table
   - `cars` table
   - `fuel_entries` table
3. The policies should already be created by the SQL script in Step 5
4. These policies ensure:
   - Users can only read/write their own data
   - Users can only see their own cars
   - Users can only see fuel entries for their own cars

---

## Step 7: Install Supabase Dependencies

1. In your project root, install the required packages:

\`\`\`bash
npm install @supabase/supabase-js @supabase/ssr
\`\`\`

2. Commit the updated `package.json` and `package-lock.json`

---

## Step 8: Uncomment Authentication Code

The authentication code is already in your project but commented out. You need to uncomment it:

### Files to Uncomment:

1. **`lib/supabase/client.ts`** - Client-side Supabase client
2. **`lib/supabase/server.ts`** - Server-side Supabase client
3. **`lib/supabase/middleware.ts`** - Middleware for token refresh
4. **`middleware.ts`** - Route protection middleware
5. **`app/auth/login/page.tsx`** - Login page
6. **`app/auth/signup/page.tsx`** - Signup page
7. **`app/auth/callback/route.ts`** - Auth callback handler
8. **`app/auth/logout/route.ts`** - Logout handler
9. **`components/auth/login-form.tsx`** - Login form component
10. **`components/auth/signup-form.tsx`** - Signup form component
11. **`components/user-nav.tsx`** - User navigation with logout

### How to Uncomment:

Each file has block comments like this:

\`\`\`typescript
/* UNCOMMENT WHEN SUPABASE IS INSTALLED
... code here ...
*/
\`\`\`

Simply remove the `/*` at the start and `*/` at the end to activate the code.

---

## Step 9: Update API Routes for Multi-User Support

After uncommenting the auth code, you'll need to update your API routes to:
1. Get the current user from Supabase
2. Filter data by user ID
3. Associate new entries with the current user

The following files need to be updated (instructions are in comments):
- `app/api/fuel-entries/route.ts`
- `app/api/fuel-entries/[id]/route.ts`
- `app/api/cars/route.ts` (new endpoint for car management)

---

## Step 10: Deploy and Test

1. **Redeploy your app** to Vercel:
   \`\`\`bash
   git add .
   git commit -m "Enable Supabase authentication"
   git push
   \`\`\`

2. **Test the authentication flow**:
   - Visit your app
   - You should be redirected to the login page
   - Click "Sign up" to create a new account
   - Enter email and password
   - Check your email for verification link
   - Click the verification link
   - You should be redirected back to your app and logged in

3. **Test multi-user isolation**:
   - Create a fuel entry with User A
   - Log out
   - Sign up as User B
   - Verify that User B cannot see User A's entries

---

## Step 11: Configure Email Templates (Optional)

1. In Supabase dashboard, go to **Authentication** → **Email Templates**
2. Customize the email templates for:
   - Confirmation email (sent when users sign up)
   - Password reset email
   - Magic link email (if you enable magic links)
3. Add your branding and customize the messaging

---

## Troubleshooting

### Issue: "Invalid API key" error

**Solution**: Double-check that your environment variables are correct:
- `NEXT_PUBLIC_SUPABASE_URL` should be your project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` should be the anon/public key (not the service role key)

### Issue: Users can see other users' data

**Solution**: Verify that Row Level Security (RLS) is enabled:
1. Go to Supabase dashboard → Database → Tables
2. Click on each table (users, cars, fuel_entries)
3. Ensure "Enable RLS" is toggled ON
4. Verify policies are created (check Authentication → Policies)

### Issue: "Auth session missing" error

**Solution**: 
1. Check that middleware is properly configured
2. Verify that cookies are being set (check browser dev tools → Application → Cookies)
3. Ensure `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` is set for local development

### Issue: Email verification not working

**Solution**:
1. Check your Supabase email settings (Authentication → Email)
2. For development, you can disable email confirmation:
   - Go to Authentication → Settings
   - Toggle OFF "Enable email confirmations"
   - (Remember to re-enable for production!)

### Issue: Redirect loop after login

**Solution**:
1. Check that `/auth/callback` is in your Supabase redirect URLs
2. Verify that the callback route handler is working
3. Check browser console for errors

---

## Security Best Practices

1. **Never commit your Supabase keys** to Git (they should only be in Vercel environment variables)
2. **Always use RLS policies** to protect user data
3. **Use the anon key** for client-side code (never use the service role key in the browser)
4. **Enable email verification** in production
5. **Set up password requirements** in Supabase Auth settings
6. **Monitor auth logs** in Supabase dashboard for suspicious activity

---

## Next Steps

After authentication is working:

1. **Add user profiles**: Allow users to set their name, profile picture, etc.
2. **Add car management**: Let users add/edit/delete their cars
3. **Add password reset**: Implement forgot password functionality
4. **Add social auth**: Enable Google, GitHub, or other OAuth providers
5. **Add email notifications**: Send users summaries of their fuel usage

---

## Support

If you encounter issues:
1. Check the Supabase documentation: https://supabase.com/docs
2. Check the Next.js + Supabase guide: https://supabase.com/docs/guides/auth/server-side/nextjs
3. Review the troubleshooting section above
4. Check your browser console and Vercel logs for errors

---

## Summary

You've now set up:
- ✅ Supabase project and authentication
- ✅ Environment variables in Vercel
- ✅ Database schema for multi-user support
- ✅ Row Level Security for data isolation
- ✅ Login and signup pages
- ✅ Protected routes with middleware
- ✅ Multi-car support per user

Your Fuel Logbook app now supports multiple users, each with their own secure account and data!
