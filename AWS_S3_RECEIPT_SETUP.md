# AWS S3 Setup for Receipt Uploads (via Console)

This guide will walk you through setting up AWS S3 for storing fuel receipt images. All receipts are automatically converted to AVIF format for optimal storage efficiency.

## Overview

- **What**: Store receipt images in AWS S3
- **Format**: JPEG/PNG uploads are automatically converted to AVIF (80% smaller files)
- **Security**: Private bucket with signed URLs for secure access
- **Cost**: ~$0.023 per GB/month in Cape Town region (af-south-1)

---

## Step 1: Create an S3 Bucket for Receipts

### 1.1 Navigate to S3

1. Log in to [AWS Console](https://console.aws.amazon.com/)
2. In the search bar at the top, type **"S3"**
3. Click on **"S3"** from the results

### 1.2 Create the Bucket

1. Click the **"Create bucket"** button (orange button on the right)

2. **Bucket Configuration:**
    - **Bucket name**: `fuel-logbook-receipts-[yourname]`
        - Example: `fuel-logbook-receipts-john`
        - Must be globally unique (lowercase, numbers, hyphens only)
    - **AWS Region**: Select **`af-south-1`** (Cape Town) for South African users
        - Or choose the region closest to you

3. **Object Ownership:**
    - Keep **"ACLs disabled (recommended)"** selected

4. **Block Public Access settings:**
    - ✅ Keep ALL checkboxes CHECKED
    - This keeps your receipts private (important for security)
    - **Note**: The app uses signed URLs for secure access, so public access is NOT needed

5. **Bucket Versioning:**
    - Select **"Disable"** (you don't need version history for receipts)

6. **Default encryption:**
    - Select **"Enable"**
    - Choose **"Server-side encryption with Amazon S3 managed keys (SSE-S3)"**
    - This encrypts your receipts at rest

7. Click **"Create bucket"** at the bottom

---

## Step 2: Create IAM User with S3 Access

### 2.1 Navigate to IAM

1. In the AWS Console search bar, type **"IAM"**
2. Click on **"IAM"** (Identity and Access Management)

### 2.2 Create New User

1. In the left sidebar, click **"Users"**
2. Click the **"Create user"** button
3. **User name**: `fuel-logbook-app`
4. Click **"Next"**

### 2.3 Set Permissions

1. Select **"Attach policies directly"**
2. Click **"Create policy"** (opens in new tab)

### 2.4 Create Custom Policy (Secure)

In the new tab:

1. Click the **"JSON"** tab
2. **Delete** the existing JSON
3. **Paste** this policy (replace `YOUR-BUCKET-NAME` with your actual bucket name):

\`\`\`json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ReceiptUploadAccess",
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/receipts/*"
    },
    {
      "Sid": "ListBucketAccess",
      "Effect": "Allow",
      "Action": "s3:ListBucket",
      "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME",
      "Condition": {
        "StringLike": {
          "s3:prefix": "receipts/*"
        }
      }
    }
  ]
}
\`\`\`

4. Click **"Next"**
5. **Policy name**: `FuelLogbookReceiptUploadPolicy`
6. **Description**: "Allows uploading and managing receipt images in S3"
7. Click **"Create policy"**

### 2.5 Attach Policy to User

1. Go back to the previous tab (Create user page)
2. Click the **refresh icon** next to the policy search box
3. Search for **"FuelLogbookReceiptUploadPolicy"**
4. ✅ Check the box next to your policy
5. Click **"Next"**
6. Review and click **"Create user"**

---

## Step 3: Generate Access Keys

### 3.1 Access User Security Credentials

1. Click on the newly created user **"fuel-logbook-app"**
2. Click the **"Security credentials"** tab
3. Scroll down to **"Access keys"** section

### 3.2 Create Access Key

1. Click **"Create access key"**
2. Select **"Application running outside AWS"**
3. ✅ Check the confirmation checkbox
4. Click **"Next"**
5. **Description tag** (optional): `Fuel Logbook Receipt Uploads`
6. Click **"Create access key"**

### 3.3 Save Credentials Securely

⚠️ **CRITICAL**: You can only view the secret key ONCE!

1. **Copy and save these values immediately:**
    - **Access key ID**: `AKIAIOSFODNN7EXAMPLE`
    - **Secret access key**: `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY`

2. Click **"Download .csv file"** to save them securely

3. Store the CSV file in a secure location (password manager recommended)

4. Click **"Done"**

---

## Step 4: Configure Environment Variables

### 4.1 In Vercel Dashboard

1. Go to [vercel.com](https://vercel.com/)
2. Open your **Fuel Logbook** project
3. Click **"Settings"** tab
4. Click **"Environment Variables"** in the left sidebar

### 4.2 Add AWS Credentials

Add these **4 environment variables**:

**Variable 1: AWS Access Key**
- **Name**: `AWS_ACCESS_KEY_ID`
- **Value**: [Paste your Access key ID from Step 3.3]
- **Environment**: ✅ Production, ✅ Preview, ✅ Development
- Click **"Save"**

**Variable 2: AWS Secret Key**
- **Name**: `AWS_SECRET_ACCESS_KEY`
- **Value**: [Paste your Secret access key from Step 3.3]
- **Environment**: ✅ Production, ✅ Preview, ✅ Development
- Click **"Save"**

**Variable 3: AWS Region**
- **Name**: `AWS_REGION`
- **Value**: `af-south-1` (or your chosen region)
- **Environment**: ✅ Production, ✅ Preview, ✅ Development
- Click **"Save"**

**Variable 4: S3 Bucket Name**
- **Name**: `AWS_S3_BUCKET_NAME`
- **Value**: [Your bucket name from Step 1.2]
- **Environment**: ✅ Production, ✅ Preview, ✅ Development
- Click **"Save"**

### 4.3 Redeploy Application

1. Go to the **"Deployments"** tab
2. Click the **three dots (⋯)** on the latest deployment
3. Click **"Redeploy"**
4. Wait for deployment to complete

---

## Step 5: Test Receipt Upload

### 5.1 Upload a Test Receipt

1. Open your deployed Fuel Logbook app
2. Go to **"Add Fuel Entry"**
3. Click **"Choose File"** under Receipt Image
4. Select a JPEG or PNG image
5. Watch for the success message showing:
    - ✅ "Receipt uploaded to AWS S3"
    - Compression ratio (e.g., "65% smaller")

### 5.2 Verify in S3 Console

1. Go back to [AWS S3 Console](https://s3.console.aws.amazon.com/)
2. Click on your bucket name
3. Click on the **"receipts/"** folder
4. You should see your uploaded file with `.avif` extension
5. Click on the file to view details

### 5.3 View Receipt in App

1. Go to your fuel log dashboard
2. Find the entry with the receipt
3. Click **"View Receipt"** link
4. The receipt should open in a new tab using a secure signed URL

---

## Understanding Signed URLs (Security Feature)

### What Are Signed URLs?

Signed URLs are temporary, secure links that allow access to private S3 objects without making your bucket public.

### How It Works

1. **Upload**: Receipt is stored in your private S3 bucket
2. **Storage**: The S3 URL is saved in the database
3. **Viewing**: When you click "View Receipt", the app generates a signed URL
4. **Access**: The signed URL grants temporary access (1 hour) to view the receipt
5. **Expiration**: After 1 hour, the URL expires and cannot be used

### Benefits

- ✅ **Security**: Your S3 bucket remains completely private
- ✅ **No public access**: Receipts cannot be accessed without authorization
- ✅ **Temporary access**: URLs expire automatically
- ✅ **Controlled access**: Only your app can generate signed URLs

### Why Not Make Bucket Public?

Making your bucket public would allow anyone with the URL to view your receipts. Signed URLs ensure only authorized users can access receipts through your app.

---

## Understanding AVIF Conversion

### What Happens When You Upload

1. **You upload**: JPEG or PNG image (e.g., 2.5 MB)
2. **Server converts**: Automatically converts to AVIF format
3. **Result**: Smaller file (e.g., 800 KB) with same visual quality
4. **Savings**: Typically 60-80% smaller file size

### Benefits

- **Lower storage costs**: Pay less for S3 storage
- **Faster loading**: Smaller files load quicker
- **Better quality**: AVIF maintains image quality better than JPEG at smaller sizes
- **Modern format**: Supported by all modern browsers

---

## Cost Estimation

### S3 Storage Costs (Cape Town - af-south-1)

- **Storage**: $0.023 per GB/month
- **PUT requests**: $0.005 per 1,000 uploads
- **GET requests**: $0.0004 per 1,000 views

### Example Monthly Cost

Assuming:
- 50 receipts per month
- Average 500 KB per AVIF image
- Total storage: 25 MB

**Monthly cost**: ~$0.01 (less than 1 cent!)

For 1 year (600 receipts, 300 MB): ~$0.12/month

---

## Security Best Practices

### ✅ What We've Implemented

- ✅ Private bucket (no public access)
- ✅ IAM user with minimal permissions (only receipts folder)
- ✅ Server-side encryption (SSE-S3)
- ✅ Secure credential storage (Vercel environment variables)
- ✅ Signed URLs for temporary, secure access
- ✅ Automatic URL expiration (1 hour)

### 🔒 Additional Recommendations

1. **Rotate access keys** every 90 days
2. **Enable CloudTrail** to log all S3 access
3. **Set up S3 lifecycle rules** to archive old receipts to Glacier (cheaper storage)
4. **Enable MFA** on your AWS root account

---

## Troubleshooting

### Error: "Access Denied" when viewing receipts

**Cause**: This was the original issue - bucket was private but app wasn't using signed URLs

**Solution**: ✅ **FIXED** - The app now uses signed URLs automatically

If you still see this error:
1. Verify the IAM policy includes `s3:GetObject` permission
2. Check that environment variables are set correctly in Vercel
3. Ensure the IAM user has the custom policy attached
4. Redeploy your Vercel app

### Error: "Access Denied" when uploading

**Cause**: IAM policy or credentials issue

**Solution**:
1. Verify the bucket name in your policy matches exactly
2. Check that environment variables are set correctly in Vercel
3. Ensure the IAM user has the custom policy attached with `s3:PutObject`
4. Redeploy your Vercel app after adding variables

### Error: "Bucket not found"

**Cause**: Bucket name mismatch or wrong region

**Solution**:
1. Double-check `AWS_S3_BUCKET_NAME` matches your bucket name exactly
2. Verify `AWS_REGION` matches your bucket's region
3. Check for typos (bucket names are case-sensitive)

### Error: "Invalid credentials"

**Cause**: Wrong access keys or expired keys

**Solution**:
1. Go to IAM → Users → fuel-logbook-app → Security credentials
2. Deactivate old access key
3. Create new access key
4. Update environment variables in Vercel
5. Redeploy

### Signed URL expires too quickly

**Cause**: Default expiration is 1 hour

**Solution**: If you need longer access, you can modify the expiration time in `lib/s3-client.ts`:
\`\`\`typescript
// Change from 3600 (1 hour) to 7200 (2 hours) or longer
const signedUrl = await getSignedUrlForObject(key, 7200)
\`\`\`

---

## Next Steps

✅ Your receipt upload system is now configured with secure signed URLs!

**What you can do:**
- Upload receipt images when adding fuel entries
- Images are automatically converted to AVIF
- Receipts are securely stored in your private S3 bucket
- View receipts using temporary signed URLs (no public access needed)

**Optional enhancements:**
- Set up S3 lifecycle rules to archive old receipts
- Enable S3 versioning for receipt history
- Configure CloudFront CDN for faster image delivery
- Adjust signed URL expiration time based on your needs
