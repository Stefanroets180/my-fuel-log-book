# Installing Supabase Packages

After you've set up your Supabase project and configured the environment variables, you need to install the required Supabase packages.

## Step 1: Install Supabase Dependencies

Run the following command in your project root directory:

\`\`\`bash
npm install @supabase/supabase-js @supabase/ssr
\`\`\`

This will install:
- `@supabase/supabase-js` - The main Supabase client library
- `@supabase/ssr` - Server-side rendering utilities for Next.js

## Step 2: Verify Installation

After installation, verify that the packages were added to your `package.json`:

\`\`\`json
"dependencies": {
  "@supabase/supabase-js": "^2.x.x",
  "@supabase/ssr": "^0.x.x",
  // ... other dependencies
}
\`\`\`

## Step 3: Update package-lock.json

Make sure to commit both `package.json` and `package-lock.json` to your repository:

\`\`\`bash
git add package.json package-lock.json
git commit -m "Add Supabase dependencies"
\`\`\`

## Step 4: Rebuild Your Project

If you're running the development server, restart it:

\`\`\`bash
# Stop the current dev server (Ctrl+C)
npm run dev
\`\`\`

## Next Steps

After installing the packages, proceed to uncomment the authentication code as described in `SUPABASE_AUTHENTICATION_SETUP.md`.

## Troubleshooting

### Issue: "Cannot find module '@supabase/supabase-js'"

**Solution**: Make sure you've run `npm install` and the packages are listed in your `package.json`.

### Issue: Version conflicts

**Solution**: If you encounter version conflicts, try:
\`\`\`bash
npm install @supabase/supabase-js@latest @supabase/ssr@latest
\`\`\`

### Issue: Build errors after installation

**Solution**: Clear your Next.js cache and rebuild:
\`\`\`bash
rm -rf .next
npm run build
