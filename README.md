# Fuel Logbook App

A modern, multi-user fuel tracking application built with Next.js, Supabase, and AWS S3.

## Features

- **Multi-User Authentication**: Secure login with Supabase Auth
- **Multiple Cars**: Track fuel for multiple vehicles
- **Fuel Entry Tracking**: Log date, odometer, liters, price, and more
- **Receipt Storage**: Upload and store receipts in AWS S3
- **Fuel Economy Calculation**: Automatic km/L calculation
- **Work Travel Tracking**: Mark entries as work-related
- **Data Export**: Export your data to CSV or email
- **Responsive Design**: Works on desktop and mobile

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Storage**: AWS S3
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 22.14.0 or higher
- A Supabase account
- An AWS account with S3 access
- A Vercel account (for deployment)

### Installation

1. **Clone the repository**

\`\`\`bash
git clone https://github.com/YOUR_USERNAME/fuel-logbook.git
cd fuel-logbook
\`\`\`

2. **Install dependencies**

\`\`\`bash
npm install
\`\`\`

3. **Set up Supabase**

Follow the complete guide in `SUPABASE_AUTHENTICATION_SETUP.md`

4. **Set up AWS S3**

Follow the complete guide in `AWS_S3_RECEIPT_SETUP.md`

5. **Configure environment variables**

Create a `.env.local` file:

\`\`\`bash
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

6. **Install Supabase packages**

\`\`\`bash
npm install @supabase/supabase-js @supabase/ssr
\`\`\`

7. **Uncomment authentication code**

See `INSTALL_SUPABASE_PACKAGES.md` for the list of files to uncomment.

8. **Run the development server**

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

See `COMPLETE_DEPLOYMENT_GUIDE.md` for detailed deployment instructions.

**Quick Deploy to Vercel:**

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add environment variables
4. Deploy

## Documentation

- **`COMPLETE_DEPLOYMENT_GUIDE.md`** - Master deployment guide
- **`SUPABASE_AUTHENTICATION_SETUP.md`** - Supabase setup instructions
- **`SUPABASE_FRESH_SETUP.md`** - Fresh Supabase database setup
- **`AWS_S3_RECEIPT_SETUP.md`** - S3 configuration guide
- **`DATABASE_MIGRATION_GUIDE.md`** - Database migration instructions
- **`CAR_MANAGEMENT_GUIDE.md`** - Car management feature guide
- **`INSTALL_SUPABASE_PACKAGES.md`** - Package installation guide

## Project Structure

\`\`\`
fuel-logbook/
├── app/                      # Next.js app directory
│   ├── api/                  # API routes
│   │   ├── cars/            # Car management endpoints
│   │   ├── fuel-entries/    # Fuel entry endpoints
│   │   └── upload-receipt/  # Receipt upload endpoint
│   ├── auth/                # Authentication pages
│   │   ├── login/           # Login page
│   │   ├── signup/          # Signup page
│   │   └── callback/        # Auth callback handler
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── components/              # React components
│   ├── auth/               # Authentication components
│   ├── ui/                 # shadcn/ui components
│   └── ...                 # Other components
├── lib/                    # Utility functions
│   ├── supabase/          # Supabase clients
│   ├── db.ts              # Database client
│   └── s3-client.ts       # S3 client
├── scripts/               # Database scripts
│   ├── supabase-schema.sql
│   └── ...
└── docs/                  # Documentation (markdown files)
\`\`\`

## Features in Detail

### Authentication

- Email/password authentication via Supabase
- Email verification
- Protected routes with middleware
- Row Level Security (RLS) for data isolation

### Car Management

- Add multiple cars per user
- Track make, model, year, and registration
- Set a default car for quick entry
- Edit and delete cars

### Fuel Entry Tracking

- Log fuel purchases with detailed information
- Automatic fuel economy calculation (km/L)
- Upload receipt images
- Mark entries as work-related
- Add notes to entries

### Data Export

- Export to CSV
- Email export functionality
- Export to AWS S3

## Security

- All user data is isolated using Row Level Security (RLS)
- Passwords are hashed by Supabase Auth
- API endpoints require authentication
- Environment variables are never committed to Git
- AWS S3 receipts are stored securely

## Contributing

This is a personal project, but suggestions and feedback are welcome!

## License

MIT License - feel free to use this project for your own purposes.

## Support

For issues or questions:
1. Check the documentation in the `/docs` folder
2. Review the troubleshooting sections
3. Check Supabase and Vercel logs

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Authentication by [Supabase](https://supabase.com/)
- Deployed on [Vercel](https://vercel.com/)

---

**Happy fuel tracking!**
