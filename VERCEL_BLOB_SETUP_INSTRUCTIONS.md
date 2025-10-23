# Vercel Blob Setup Instructions

This guide will walk you through setting up Vercel Blob storage for your fuel logbook app to store receipt images.

## What is Vercel Blob?

Vercel Blob is a simple, scalable object storage solution that's perfect for storing files like images, PDFs, and other assets. It's integrated directly with Vercel and requires minimal setup.

---

## Step 1: Access Your Vercel Project

1. Go to [vercel.com](https://vercel.com) and sign in
2. Navigate to your project dashboard
3. Select the project where your fuel logbook app is deployed (or will be deployed)

---

## Step 2: Enable Vercel Blob

### Option A: Through Vercel Dashboard

1. In your project dashboard, click on the **"Storage"** tab in the top navigation
2. Click on **"Create Database"** or **"Connect Store"**
3. Select **"Blob"** from the available storage options
4. Click **"Continue"**
5. Choose a name for your Blob store (e.g., `fuel-receipts-blob`)
6. Select your desired region (choose closest to your users for best performance)
7. Click **"Create"**

### Option B: Through Project Settings

1. Go to your project's **Settings** tab
2. Navigate to **"Storage"** in the left sidebar
3. Click **"Connect Store"**
4. Select **"Blob"** and follow the prompts above

---

## Step 3: Get Your Blob Token

Once created, Vercel automatically adds the required environment variable to your project:

- `BLOB_READ_WRITE_TOKEN` - This token allows your app to upload and read files

**To verify the token is set:**

1. Go to **Settings** → **Environment Variables**
2. Look for `BLOB_READ_WRITE_TOKEN`
3. It should be automatically set for all environments (Production, Preview, Development)

---

## Step 4: Local Development Setup

For local development, you need to pull the environment variables:

### Using Vercel CLI (Recommended)

\`\`\`bash
# Install Vercel CLI if you haven't already
npm i -g vercel

# Link your project
vercel link

# Pull environment variables
vercel env pull .env.local
\`\`\`

This creates a `.env.local` file with your `BLOB_READ_WRITE_TOKEN`.

### Manual Setup (Alternative)

If you prefer not to use the CLI:

1. Go to **Settings** → **Environment Variables** in your Vercel dashboard
2. Find `BLOB_READ_WRITE_TOKEN`
3. Click the eye icon to reveal the token
4. Create a `.env.local` file in your project root:

\`\`\`env
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxxxxxxx
\`\`\`

⚠️ **Important:** Never commit `.env.local` to version control. It should be in your `.gitignore`.

---

## Step 5: Test the Integration

The app is already configured to use Vercel Blob. To test:

1. Run your development server:
   \`\`\`bash
   npm run dev
   \`\`\`

2. Open the app at `http://localhost:3000`

3. Try adding a fuel entry with a receipt image:
   - Fill in the fuel entry form
   - Click "Upload Receipt" and select an image
   - The image should upload successfully and show a preview

4. Check the Vercel dashboard:
   - Go to **Storage** → **Blob**
   - You should see your uploaded receipt image listed

---

## Step 6: Understanding Blob Storage Limits

### Free Tier Limits (Hobby Plan)
- **Storage:** 1 GB
- **Bandwidth:** 100 GB/month
- **File size limit:** 4.5 MB per file

### Pro Plan Limits
- **Storage:** 100 GB included
- **Bandwidth:** 1 TB/month included
- **File size limit:** 500 MB per file

For receipt images (typically 100-500 KB each), the free tier should handle hundreds of receipts.

---

## Step 7: Monitoring Usage

To monitor your Blob storage usage:

1. Go to your project dashboard
2. Click **Storage** → **Blob**
3. View:
   - Total files stored
   - Storage used
   - Bandwidth consumed
   - Recent uploads

---

## How the App Uses Vercel Blob

The fuel logbook app uses Vercel Blob in the following ways:

### Upload Receipt (API Route: `/api/upload-receipt`)
\`\`\`typescript
// When user uploads a receipt image
const blob = await put(file.name, file, {
  access: 'public',
  token: process.env.BLOB_READ_WRITE_TOKEN,
});
// Returns: { url: 'https://...', downloadUrl: '...' }
\`\`\`

### Display Receipt
- Receipt URLs are stored in the database
- Images are served directly from Vercel's CDN
- Fast, global delivery with automatic caching

### Delete Receipt (When Deleting Fuel Entry)
\`\`\`typescript
// Automatically deletes the blob when entry is deleted
await del(receiptUrl, {
  token: process.env.BLOB_READ_WRITE_TOKEN,
});
\`\`\`

---

## Troubleshooting

### Issue: "BLOB_READ_WRITE_TOKEN is not defined"

**Solution:**
- Make sure you've created the Blob store in Vercel
- Pull environment variables: `vercel env pull .env.local`
- Restart your development server

### Issue: Upload fails with "Access denied"

**Solution:**
- Verify the token is correctly set in `.env.local`
- Check that the token hasn't been revoked in Vercel dashboard
- Ensure you're using `access: 'public'` in the upload call

### Issue: Images not displaying

**Solution:**
- Check that the URL is being saved correctly in the database
- Verify the blob URL is publicly accessible
- Check browser console for CORS or network errors

### Issue: File size too large

**Solution:**
- Free tier limit is 4.5 MB per file
- Compress images before upload or implement client-side compression
- Consider upgrading to Pro plan for 500 MB limit

---

## Security Best Practices

1. **Never expose your token:**
   - Keep `BLOB_READ_WRITE_TOKEN` in environment variables only
   - Never commit it to version control
   - Never send it to the client

2. **Validate uploads:**
   - The app already validates file types (images only)
   - Consider adding file size validation
   - Implement rate limiting for uploads

3. **Use public access carefully:**
   - Receipts are set to `public` access for easy viewing
   - Anyone with the URL can view the image
   - Don't upload sensitive documents you want to keep private

---

## Next Steps

✅ Vercel Blob is now set up and ready to use!

Your fuel logbook app will automatically:
- Upload receipt images to Vercel Blob
- Store the URLs in your Neon database
- Display receipts in the dashboard
- Delete blobs when entries are removed

For production deployment, Vercel will automatically use the production `BLOB_READ_WRITE_TOKEN`.

---

## Additional Resources

- [Vercel Blob Documentation](https://vercel.com/docs/storage/vercel-blob)
- [Vercel Blob API Reference](https://vercel.com/docs/storage/vercel-blob/using-blob-sdk)
- [Pricing Information](https://vercel.com/docs/storage/vercel-blob/usage-and-pricing)
