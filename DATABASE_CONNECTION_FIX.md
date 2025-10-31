# Database Connection Fix Guide

## Problem Identified

The API routes were using tagged template literal syntax for SQL queries:
\`\`\`typescript
await sql`SELECT * FROM cars WHERE id = ${id}`
\`\`\`

However, the `lib/db.ts` file was using a custom implementation that didn't support this syntax.

## Solution Applied

### 1. Added `postgres` Package

Added the `postgres` npm package to `package.json`:
\`\`\`json
"postgres": "^3.4.5"
\`\`\`

This package provides native support for tagged template literals and is optimized for PostgreSQL databases like Supabase.

### 2. Updated `lib/db.ts`

Replaced the custom SQL implementation with the `postgres` library:
\`\`\`typescript
import postgres from 'postgres'

export const sql = postgres(connectionString, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
})
\`\`\`

## Environment Variables Required

You need to set up the `DATABASE_URL` environment variable in your `.env.local` file:

\`\`\`env
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
\`\`\`

### How to Get Your Database URL from Supabase:

1. Go to your Supabase project dashboard
2. Click on **Settings** (gear icon in sidebar)
3. Click on **Database**
4. Scroll down to **Connection string**
5. Select **URI** tab
6. Copy the connection string
7. Replace `[YOUR-PASSWORD]` with your database password

**Example:**
\`\`\`
postgresql://postgres:your_password_here@db.abcdefghijklmnop.supabase.co:5432/postgres
\`\`\`

## Installation Steps

1. **Install the new dependency:**
   \`\`\`bash
   npm install
   \`\`\`

2. **Add DATABASE_URL to `.env.local`:**
   \`\`\`env
   DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT-REF].supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR-ANON-KEY]
   SUPABASE_SERVICE_ROLE_KEY=[YOUR-SERVICE-ROLE-KEY]
   \`\`\`

3. **Restart your development server:**
   \`\`\`bash
   npm run dev
   \`\`\`

## What This Fixes

This fix resolves errors in the following API routes:
- ✅ `app/api/cars/route.ts` - GET and POST car operations
- ✅ `app/api/cars/[id]/route.ts` - GET, PUT, DELETE single car operations
- ✅ `app/api/fuel-entries/route.ts` - GET and POST fuel entry operations
- ✅ `app/api/fuel-entries/[id]/route.ts` - DELETE and PATCH fuel entry operations

## Benefits of This Approach

1. **Tagged Template Literals**: Natural SQL syntax with automatic escaping
2. **SQL Injection Protection**: Parameters are automatically escaped
3. **Type Safety**: Better TypeScript support
4. **Connection Pooling**: Efficient database connection management
5. **Performance**: Optimized for PostgreSQL databases

## Troubleshooting

### Error: "DATABASE_URL environment variable is not set"
- Make sure you've created `.env.local` file in the root directory
- Verify the DATABASE_URL is correctly formatted
- Restart your development server after adding environment variables

### Error: "Connection refused"
- Check that your Supabase project is active
- Verify your database password is correct
- Ensure your IP address is allowed in Supabase (check Database Settings > Connection Pooling)

### Error: "relation does not exist"
- Run the database schema: `supabase-fresh-schema.sql`
- Make sure all tables are created in your Supabase database

## Alternative: Using Supabase Client Directly

If you prefer to use Supabase's client methods instead of raw SQL, you can modify the API routes to use:

\`\`\`typescript
const { data, error } = await supabase
  .from('cars')
  .select('*')
  .eq('user_id', user.id)
\`\`\`

However, the current implementation with `postgres` library is more flexible for complex queries.
