# Fuel Logbook App

A comprehensive Next.js application for tracking vehicle fuel consumption, expenses, and generating reports for tax purposes (SARS - South African Revenue Service).

## Features

- **Fuel Entry Tracking**: Record fuel purchases with date, odometer reading, liters, price per liter (ZAR), and petrol station
- **Receipt Management**: Upload and store receipt images in AWS S3 with automatic AVIF conversion
- **Automatic Calculations**:
    - Total cost per fill-up
    - Kilometers per liter (km/L) consumption
    - Distance traveled between fill-ups
- **Work Travel Tracking**: Mark entries for SARS (South African Revenue Service) tax purposes
- **Statistics Dashboard**: View total spent, total liters, average consumption, and work travel summaries
- **Export Options**:
    - Download HTML reports with full logbook data
    - Backup to AWS S3 in JSON format
- **Data Management**: Delete entries with automatic receipt cleanup
- **Image Optimization**: Automatic JPEG/PNG to AVIF conversion (60-80% smaller files)

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Database**: Neon Postgres (serverless)
- **File Storage**: AWS S3 (receipt images in AVIF format)
- **Cloud Backup**: AWS S3
- **UI Components**: shadcn/ui with Radix UI
- **Styling**: Tailwind CSS v4
- **Image Processing**: Sharp (JPEG/PNG to AVIF conversion)

## � Setup Guides

This project includes comprehensive step-by-step setup guides:

1. **[NEON_DATABASE_SETUP_INSTRUCTIONS.md](./NEON_DATABASE_SETUP_INSTRUCTIONS.md)** - Complete guide for setting up your Neon Postgres database
    - Creating a Neon account and project
    - Connecting to Vercel
    - Running database migrations
    - Local development setup
    - Troubleshooting common issues

2. **[AWS_S3_RECEIPT_SETUP.md](./AWS_S3_RECEIPT_SETUP.md)** - Complete guide for AWS S3 receipt storage (REQUIRED)
    - Creating an S3 bucket via AWS Console
    - Setting up IAM users and permissions (no CLI required)
    - Generating access keys
    - Configuring environment variables
    - Understanding AVIF conversion
    - Security best practices

3. **[AWS_S3_SETUP_INSTRUCTIONS.md](./AWS_S3_SETUP_INSTRUCTIONS.md)** - Guide for AWS S3 data backup (optional)
    - Setting up a separate bucket for data exports
    - Exporting logbook data to S3

4. **[FRESH_DEPLOYMENT_GUIDE.md](./FRESH_DEPLOYMENT_GUIDE.md)** - Complete deployment guide
    - Downloading and uploading to GitHub
    - Deploying from a fresh Vercel account
    - Setting up all integrations

**� Start with the Neon and AWS S3 Receipt guides first, then optionally set up data export to S3.**

## Quick Start

### Prerequisites

- Node.js 18+ installed
- Vercel account (free tier works)
- Neon account (free tier works)
- AWS account (required for receipt storage)

### Installation Steps

1. **Clone or download this project**

2. **Install dependencies**:
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up Neon Database**:
    - Follow **[NEON_DATABASE_SETUP_INSTRUCTIONS.md](./NEON_DATABASE_SETUP_INSTRUCTIONS.md)**
    - Create your Neon project
    - Connect to Vercel or set up environment variables
    - Run the database migration script

4. **Set up AWS S3 Receipts**:
    - Follow **[AWS_S3_RECEIPT_SETUP.md](./AWS_S3_RECEIPT_SETUP.md)**
    - Create your S3 bucket and IAM user
    - Set up environment variables

5. **Pull environment variables** (if using Vercel):
   \`\`\`bash
   npm i -g vercel
   vercel link
   vercel env pull .env.local
   \`\`\`

6. **Run the development server**:
   \`\`\`bash
   npm run dev
   \`\`\`

7. **Open your browser**:
    - Navigate to [http://localhost:3000](http://localhost:3000)
    - Start adding fuel entries!

### Database Setup

The database schema is located at `scripts/001_create_fuel_entries_table.sql`.

**To create the table:**

**Option 1: Neon SQL Editor (Recommended)**
1. Go to [console.neon.tech](https://console.neon.tech)
2. Select your project
3. Click "SQL Editor"
4. Copy and paste the contents of `scripts/001_create_fuel_entries_table.sql`
5. Click "Run"

**Option 2: Command Line (if you have psql)**
\`\`\`bash
psql "your-neon-connection-string" -f scripts/001_create_fuel_entries_table.sql
\`\`\`

See **[NEON_DATABASE_SETUP_INSTRUCTIONS.md](./NEON_DATABASE_SETUP_INSTRUCTIONS.md)** for detailed instructions.

## Environment Variables

### Required Variables

**Neon Database** (automatically set when using Neon integration):
\`\`\`env
NEON_NEON_DATABASE_URL="postgresql://..."
\`\`\`

**AWS S3 for Receipts** (REQUIRED - see AWS_S3_RECEIPT_SETUP.md):
\`\`\`env
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
AWS_REGION="af-south-1"
AWS_S3_BUCKET_NAME="your-bucket-name"
\`\`\`

### Optional Variables

**AWS S3** (for data backup functionality - uses same credentials as receipts):
- Uses the same AWS credentials as receipt storage
- Just needs the bucket configured

**How to add environment variables:**
- **In Vercel**: Settings → Environment Variables
- **Locally**: Create a `.env.local` file (never commit this!)
- **Pull from Vercel**: Run `vercel env pull .env.local`

## Usage Guide

### Adding Fuel Entries

1. **Fill in the form** with:
    - **Date**: When you filled up
    - **Odometer Reading**: Current km on your odometer
    - **Liters**: How many liters you purchased
    - **Price per Liter**: Cost per liter in ZAR (e.g., 23.95)
    - **Petrol Station**: Name of the station (optional)
    - **Receipt Image**: Upload a photo of your receipt (automatically converted to AVIF)
    - **Work Travel**: Check if this is for work (SARS purposes)
    - **Notes**: Any additional information (optional)

2. **Click "Add Fuel Entry"**

3. **Automatic processes**:
    - Total cost is calculated automatically
    - Receipt image is converted from JPEG/PNG to AVIF format
    - Image is uploaded to AWS S3
    - Compression ratio is displayed (typically 60-80% smaller)
    - km/L is calculated from the previous entry
    - Distance traveled is calculated from odometer difference

### Understanding the Dashboard

The dashboard shows:

**Statistics Cards:**
- **Total Spent**: Sum of all fuel purchases (ZAR)
- **Total Liters**: Total fuel purchased
- **Average km/L**: Your average fuel consumption
- **Work Travel**: Number of work-related entries (for SARS)

**Fuel Entries List:**
- All entries sorted by date (newest first)
- Each entry shows: date, station, liters, cost, km/L, distance
- Receipt images are displayed if uploaded
- Work travel entries are marked with a badge
- Delete button for each entry

### Exporting Data

**Download HTML Report:**
1. Click "Export Report" button
2. An HTML file is generated with:
    - All fuel entries in a formatted table
    - Statistics summary
    - SARS work travel summary
3. The file downloads automatically
4. Open in any browser, print, or email

**Backup to AWS S3:**
1. Set up AWS S3 first (see [AWS_S3_SETUP_INSTRUCTIONS.md](./AWS_S3_SETUP_INSTRUCTIONS.md))
2. Click "Backup to S3" button
3. Data is uploaded to your S3 bucket in JSON format
4. Includes all entries and statistics
5. Timestamped filename for version control

### Deleting Entries

1. Click the **trash icon** on any entry
2. Confirm the deletion in the dialog
3. The entry is removed from the database
4. Receipt image is automatically deleted from AWS S3

**⚠️ Warning:** Deletion is permanent and cannot be undone!

## SARS Tax Compliance

This app helps you track work-related travel for South African Revenue Service (SARS) tax purposes:

### Features for SARS:
- **Work Travel Checkbox**: Mark entries as work-related
- **Detailed Records**: Date, odometer, distance, and cost for each trip
- **Export Reports**: Generate reports showing only work travel
- **Receipt Storage**: Keep digital copies of all receipts

### What to Track:
- ✅ Business trips and client visits
- ✅ Work-related errands
- ✅ Travel between work sites
- ❌ Personal travel
- ❌ Commuting to/from your regular workplace

### Tax Deduction Calculation:
The app tracks all necessary data for SARS logbook method:
- Total km traveled for work
- Fuel costs for work trips
- Dates and purposes (in notes)

**Consult a tax professional for specific SARS compliance requirements.**

## Database Schema

The `fuel_entries` table structure:

| Column | Type | Description |
|--------|------|-------------|
| `id` | SERIAL | Primary key (auto-increment) |
| `date` | TIMESTAMP | Date and time of fuel purchase |
| `odometer_reading` | INTEGER | Odometer reading in kilometers |
| `liters` | DECIMAL(10,2) | Liters of fuel purchased |
| `price_per_liter` | DECIMAL(10,2) | Price per liter in ZAR |
| `total_cost` | DECIMAL(10,2) | Total cost (liters × price) |
| `petrol_station` | VARCHAR(255) | Name of petrol station |
| `receipt_url` | TEXT | URL to receipt image in AWS S3 |
| `is_work_travel` | BOOLEAN | Flag for SARS work travel |
| `notes` | TEXT | Additional notes |
| `km_per_liter` | DECIMAL(10,2) | Calculated fuel consumption |
| `distance_traveled` | INTEGER | Distance since last fill-up |
| `created_at` | TIMESTAMP | Record creation timestamp |

## API Endpoints

### Fuel Entries
- `GET /api/fuel-entries` - Fetch all fuel entries (sorted by date)
- `POST /api/fuel-entries` - Create new fuel entry (auto-calculates km/L)
- `DELETE /api/fuel-entries/[id]` - Delete entry and associated receipt

### File Upload
- `POST /api/upload-receipt` - Upload receipt image, convert to AVIF, store in AWS S3

### Export
- `POST /api/export-s3` - Export all data to AWS S3 bucket

## Deployment to Vercel

### Step 1: Push to GitHub
\`\`\`bash
git init
git add .
git commit -m "Initial commit"
git remote add origin your-repo-url
git push -u origin main
\`\`\`

### Step 2: Import to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js

### Step 3: Add Neon Integration
1. In Vercel project settings, go to "Storage"
2. Add **Neon** integration (connects database)
3. Environment variables are automatically configured

### Step 4: Add AWS S3 Environment Variables
1. Follow [AWS_S3_RECEIPT_SETUP.md](./AWS_S3_RECEIPT_SETUP.md) to create your S3 bucket and IAM user
2. In Vercel: Settings → Environment Variables
3. Add all 4 AWS variables (see guide for details)

### Step 5: Deploy
1. Click "Deploy"
2. Wait for build to complete
3. Your app is live!

### Step 6: Run Database Migration
1. Go to your Neon Console
2. Open SQL Editor
3. Run the `scripts/001_create_fuel_entries_table.sql` script

### Step 7: Test Receipt Upload
1. Add a fuel entry with a receipt image
2. Verify it uploads successfully and shows compression ratio
3. Check your S3 bucket to see the AVIF file

## Cost Breakdown

### Free Tier (Perfect for Personal Use)

**Neon Database (Free Tier):**
- ✅ 0.5 GB storage (thousands of fuel entries)
- ✅ 191.9 compute hours/month
- ✅ Auto-suspend after 5 minutes of inactivity
- ✅ Instant wake-up
- **Cost: FREE**

**AWS S3 (Cape Town - af-south-1):**
- Storage: $0.023/GB/month
- PUT requests: $0.005 per 1,000 uploads
- GET requests: $0.0004 per 1,000 views
- **Estimated for 50 receipts/month: < $0.01/month**
- **Estimated for 1 year (600 receipts): ~$0.12/month**

**Vercel Hosting (Hobby Plan):**
- ✅ Unlimited deployments
- ✅ Automatic HTTPS
- ✅ Global CDN
- **Cost: FREE**

**Total Monthly Cost: ~$0.01** (essentially free for personal use)

### Why AVIF Saves Money

- **Before**: 50 JPEG receipts × 2.5 MB = 125 MB storage
- **After**: 50 AVIF receipts × 800 KB = 40 MB storage
- **Savings**: 68% less storage = 68% lower S3 costs

## Troubleshooting

### Database Connection Issues

**Problem**: "Could not connect to database"

**Solutions**:
- Verify `DATABASE_URL` is set in environment variables
- Check Neon integration is connected in Vercel
- Ensure database hasn't been deleted
- Run `vercel env pull .env.local` to refresh local variables
- See [NEON_DATABASE_SETUP_INSTRUCTIONS.md](./NEON_DATABASE_SETUP_INSTRUCTIONS.md) for detailed troubleshooting

### Receipt Upload Issues

**Problem**: "Failed to upload receipt"

**Solutions**:
- Verify all AWS environment variables are set correctly
- Check IAM user has correct S3 permissions
- Ensure S3 bucket exists and is in the correct region
- Verify file is an image (jpg, png, webp)
- Check file size is under 10 MB (before conversion)
- See [AWS_S3_RECEIPT_SETUP.md](./AWS_S3_RECEIPT_SETUP.md) for detailed troubleshooting

**Problem**: "Image conversion failed"

**Solutions**:
- Ensure the uploaded file is a valid image
- Check that Sharp library is installed (`npm install sharp`)
- Verify the image isn't corrupted
- Try a different image format (JPEG or PNG)

### S3 Export Issues

**Problem**: "Failed to export to S3"

**Solutions**:
- Verify all AWS environment variables are set correctly
- Check IAM user has correct permissions
- Ensure S3 bucket exists and is in the correct region
- Verify AWS credentials are valid
- See [AWS_S3_SETUP_INSTRUCTIONS.md](./AWS_S3_SETUP_INSTRUCTIONS.md) for detailed troubleshooting

### Calculation Issues

**Problem**: "km/L not calculating"

**Solutions**:
- km/L requires at least 2 entries to calculate
- Ensure odometer readings are increasing
- Check that previous entry exists
- First entry will not have km/L (no previous data)

### General Issues

**Problem**: App not loading or errors in console

**Solutions**:
1. Check browser console for specific errors
2. Verify all environment variables are set
3. Ensure database table exists (run migration script)
4. Clear browser cache and reload
5. Check Vercel deployment logs for server errors

## Development

### Project Structure

\`\`\`
fuel-logbook-app/
├── app/
│   ├── api/
│   │   ├── fuel-entries/
│   │   │   ├── route.ts          # GET, POST fuel entries
│   │   │   └── [id]/route.ts     # DELETE fuel entry
│   │   ├── upload-receipt/
│   │   │   └── route.ts          # Upload receipt to S3 (with AVIF conversion)
│   │   └── export-s3/
│   │       └── route.ts          # Export to AWS S3
│   ├── page.tsx                  # Main page
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles
├── components/
│   ├── fuel-entry-form.tsx       # Form for adding entries
│   ├── fuel-log-dashboard.tsx    # Dashboard with entries list
│   ├── export-email-dialog.tsx   # Email export dialog
│   └── export-s3-dialog.tsx      # S3 export dialog
├── lib/
│   ├── db.ts                     # Database client
│   ├── types.ts                  # TypeScript types
│   └── s3-client.ts              # AWS S3 client
├── scripts/
│   └── 001_create_fuel_entries_table.sql  # Database schema
├── AWS_S3_RECEIPT_SETUP.md       # Receipt storage setup (REQUIRED)
├── AWS_S3_SETUP_INSTRUCTIONS.md  # Data backup setup (optional)
├── NEON_DATABASE_SETUP_INSTRUCTIONS.md
├── FRESH_DEPLOYMENT_GUIDE.md
└── README.md
\`\`\`

### Running Locally

\`\`\`bash
# Install dependencies
npm install

# Set up environment variables
vercel env pull .env.local

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
\`\`\`

### Adding New Features

1. **Database changes**: Create new SQL script in `scripts/` folder
2. **API endpoints**: Add routes in `app/api/`
3. **UI components**: Add components in `components/`
4. **Types**: Update `lib/types.ts`

## Security Best Practices

✅ **Environment Variables**: Never commit `.env.local` to version control
✅ **Database**: Use connection pooling (Neon handles this automatically)
✅ **File Uploads**: Validate file types and sizes before conversion
✅ **API Routes**: Implement rate limiting for production
✅ **AWS Credentials**: Use IAM users with minimal permissions (receipts folder only)
✅ **S3 Bucket**: Keep private (no public access)
✅ **HTTPS**: Always use HTTPS in production (Vercel provides this)
✅ **Image Processing**: Server-side conversion prevents malicious uploads

## Support & Resources

### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [Neon Documentation](https://neon.tech/docs)
- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)
- [Sharp Documentation](https://sharp.pixelplumbing.com/)
- [AVIF Format Info](https://en.wikipedia.org/wiki/AVIF)

### Getting Help
- Check the setup guides in this repository
- Review troubleshooting sections
- Check browser console for errors
- Review Vercel deployment logs
- Open an issue on GitHub (if applicable)

## License

This project is open source and available for personal and commercial use.

---

**Built with ❤️ for South African drivers tracking fuel consumption and SARS compliance.**
