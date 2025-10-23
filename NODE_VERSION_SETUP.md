# Node.js Version Configuration Guide

This project requires **Node.js 22.14.0 or higher** for optimal Neon database connectivity through Vercel.

## Why Node.js 22.14.0?

- **Neon Serverless Driver**: Requires Node.js 20.9+ for WebSocket support
- **Performance**: Node.js 22.x offers improved performance and stability
- **Vercel Compatibility**: Full support for latest Node.js features on Vercel platform
- **Future-proof**: Ensures compatibility with latest database drivers and features

---

## Configuration Files

### 1. `.nvmrc` (Local Development)

This file ensures your local environment uses the correct Node.js version.

**Usage with NVM:**
\`\`\`bash
# Install the specified Node.js version
nvm install

# Use the specified version
nvm use
\`\`\`

**Usage with other version managers:**
- **fnm**: `fnm use`
- **asdf**: `asdf install nodejs`
- **Volta**: Automatically detects and uses the version

### 2. `package.json` (Engines Field)

The `engines` field specifies the minimum Node.js version:

\`\`\`json
"engines": {
  "node": ">=22.14.0"
}
\`\`\`

This ensures:
- npm/yarn warns if using an incompatible version
- CI/CD pipelines can validate the Node.js version
- Documentation for other developers

### 3. `vercel.json` (Vercel Deployment)

Configures Vercel to use Node.js 22.x runtime:

\`\`\`json
"functions": {
  "app/api/**/*.ts": {
    "runtime": "nodejs22.x"
  }
}
\`\`\`

---

## Setup Instructions

### Local Development

#### Option 1: Using NVM (Recommended)

1. **Install NVM** (if not already installed):
   \`\`\`bash
   # macOS/Linux
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   
   # Windows - use nvm-windows
   # Download from: https://github.com/coreybutler/nvm-windows/releases
   \`\`\`

2. **Install Node.js 22.14.0**:
   \`\`\`bash
   nvm install 22.14.0
   \`\`\`

3. **Use Node.js 22.14.0**:
   \`\`\`bash
   nvm use 22.14.0
   \`\`\`

4. **Set as default** (optional):
   \`\`\`bash
   nvm alias default 22.14.0
   \`\`\`

5. **Verify installation**:
   \`\`\`bash
   node --version
   # Should output: v22.14.0
   \`\`\`

#### Option 2: Direct Installation

1. **Download Node.js 22.14.0**:
   - Visit: https://nodejs.org/
   - Download the 22.14.0 installer for your OS
   - Run the installer

2. **Verify installation**:
   \`\`\`bash
   node --version
   # Should output: v22.14.0
   \`\`\`

#### Option 3: Using Volta

1. **Install Volta**:
   \`\`\`bash
   curl https://get.volta.sh | bash
   \`\`\`

2. **Pin Node.js version**:
   \`\`\`bash
   volta pin node@22.14.0
   \`\`\`

### Vercel Deployment

The `vercel.json` configuration automatically sets the Node.js runtime for Vercel deployments.

#### Verify Vercel Configuration

1. **Check Project Settings**:
   - Go to your Vercel project dashboard
   - Navigate to **Settings** → **General**
   - Under **Node.js Version**, it should show **22.x** (auto-detected from vercel.json)

2. **Manual Override** (if needed):
   - In Vercel dashboard: **Settings** → **General**
   - Find **Node.js Version**
   - Select **22.x** from dropdown
   - Click **Save**

3. **Environment Variables**:
   - Ensure all Neon environment variables are set (see NEON_DATABASE_SETUP_INSTRUCTIONS.md)
   - Vercel will use Node.js 22.x for all API routes and functions

---

## Verification

### Local Verification

After setting up Node.js 22.14.0 locally:

\`\`\`bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Install dependencies
npm install

# Test Neon connection
npm run dev
\`\`\`

Visit `http://localhost:3000` and try adding a fuel entry to verify database connectivity.

### Vercel Verification

After deploying to Vercel:

1. **Check Build Logs**:
   - Go to your Vercel deployment
   - Click on the deployment
   - Check **Build Logs** for Node.js version:
     \`\`\`
     Using Node.js 22.x
     \`\`\`

2. **Test API Routes**:
   - Visit your deployed app
   - Try adding a fuel entry
   - Check **Function Logs** in Vercel dashboard for any errors

3. **Verify Neon Connection**:
   - In Vercel dashboard: **Storage** → **Neon**
   - Should show "Connected" status
   - Test database queries through your app

---

## Troubleshooting

### Issue: "Node.js version mismatch"

**Solution:**
\`\`\`bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall with correct Node.js version
nvm use 22.14.0
npm install
\`\`\`

### Issue: "Neon connection fails locally"

**Symptoms:**
- `fetch failed` errors
- `WebSocket connection failed`

**Solution:**
1. Verify Node.js version:
   \`\`\`bash
   node --version
   # Must be 22.14.0 or higher
   \`\`\`

2. Check Neon environment variables:
   \`\`\`bash
   # In your .env.local file
   NEON_NEON_DATABASE_URL=postgresql://...
   \`\`\`

3. Restart development server:
   \`\`\`bash
   npm run dev
   \`\`\`

### Issue: "Vercel deployment uses wrong Node.js version"

**Solution:**
1. Check `vercel.json` exists and has correct configuration
2. In Vercel dashboard:
   - **Settings** → **General** → **Node.js Version**
   - Select **22.x**
   - Redeploy

3. Clear Vercel cache:
   \`\`\`bash
   vercel --force
   \`\`\`

### Issue: "npm install fails with Node.js 22.14.0"

**Solution:**
1. Update npm to latest version:
   \`\`\`bash
   npm install -g npm@latest
   \`\`\`

2. Clear npm cache:
   \`\`\`bash
   npm cache clean --force
   \`\`\`

3. Try installing again:
   \`\`\`bash
   npm install
   \`\`\`

---

## CI/CD Integration

### GitHub Actions

Add to `.github/workflows/deploy.yml`:

\`\`\`yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '22.14.0'
      
      - name: Install dependencies
        run: npm install
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
\`\`\`

### GitLab CI

Add to `.gitlab-ci.yml`:

\`\`\`yaml
image: node:22.14.0

stages:
  - build
  - deploy

build:
  stage: build
  script:
    - npm install
    - npm run build
  artifacts:
    paths:
      - .next/

deploy:
  stage: deploy
  script:
    - npm install -g vercel
    - vercel --prod --token=$VERCEL_TOKEN
\`\`\`

---

## Additional Resources

- **Node.js 22 Release Notes**: https://nodejs.org/en/blog/release/v22.14.0
- **Neon Serverless Driver Docs**: https://neon.tech/docs/serverless/serverless-driver
- **Vercel Node.js Runtime**: https://vercel.com/docs/functions/runtimes/node-js
- **NVM Documentation**: https://github.com/nvm-sh/nvm

---

## Summary

✅ **Local Development**: Use `.nvmrc` with NVM or install Node.js 22.14.0 directly  
✅ **Vercel Deployment**: `vercel.json` automatically configures Node.js 22.x runtime  
✅ **Package Management**: `package.json` engines field documents version requirement  
✅ **Neon Compatibility**: Node.js 22.14.0 ensures full WebSocket and serverless driver support

Your fuel logbook app is now configured to use Node.js 22.14.0 for optimal Neon database connectivity!
