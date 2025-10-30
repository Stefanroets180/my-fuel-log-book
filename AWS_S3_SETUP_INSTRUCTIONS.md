# AWS S3 Setup Instructions (via IAM Dashboard)

Follow these step-by-step instructions to set up AWS S3 for your Fuel Logbook app without using the AWS CLI.

## Important: Signed URLs for Security

This app uses **signed URLs** to securely access private S3 objects. This means:
- ✅ Your S3 bucket remains completely private (no public access needed)
- ✅ Receipts are accessed via temporary URLs that expire after 1 hour
- ✅ Only your app can generate these secure URLs
- ✅ No "Access Denied" errors when viewing receipts

**You do NOT need to make your bucket public or configure CORS for basic receipt viewing.**

---

## Step 1: Create an S3 Bucket

1. **Log in to AWS Console**
   - Go to https://console.aws.amazon.com/
   - Sign in with your AWS account credentials

2. **Navigate to S3**
   - In the search bar at the top, type "S3"
   - Click on "S3" from the results

3. **Create a New Bucket**
   - Click the orange "Create bucket" button
   - **Bucket name**: Enter a unique name (e.g., `fuel-logbook-receipts-yourname`)
     - Must be globally unique across all AWS accounts
     - Use lowercase letters, numbers, and hyphens only
   - **AWS Region**: Choose your preferred region (e.g., `af-south-1` for Cape Town)
   - **Object Ownership**: Keep "ACLs disabled (recommended)"
   - **Block Public Access**: Keep all checkboxes CHECKED (block all public access)
     - ✅ This is correct - the app uses signed URLs, not public access
   - **Bucket Versioning**: Disable (optional, can enable if you want version history)
   - **Default encryption**: Enable with "Server-side encryption with Amazon S3 managed keys (SSE-S3)"
   - Click "Create bucket" at the bottom

## Step 2: Create an IAM User for Programmatic Access

1. **Navigate to IAM**
   - In the AWS Console search bar, type "IAM"
   - Click on "IAM" (Identity and Access Management)

2. **Create a New User**
   - In the left sidebar, click "Users"
   - Click the "Create user" button
   - **User name**: Enter `fuel-logbook-s3-user`
   - Click "Next"

3. **Set Permissions**
   - Select "Attach policies directly"
   - Click "Create policy" (opens in new tab)

### Create Custom Policy (Recommended for Security)

In the new tab:

1. Click the **"JSON"** tab
2. **Delete** the existing JSON
3. **Paste** this policy (replace `YOUR-BUCKET-NAME` with your actual bucket name):

\`\`\`json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ReceiptManagement",
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/receipts/*"
    },
    {
      "Sid": "ListBucket",
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

**Important**: This policy includes `s3:GetObject` which is required for generating signed URLs.

4. Click **"Next"**
5. **Policy name**: `FuelLogbookS3Policy`
6. **Description**: "Allows receipt upload, viewing (via signed URLs), and deletion"
7. Click **"Create policy"**

### Attach Policy to User

1. Go back to the previous tab (Create user page)
2. Click the **refresh icon** next to the policy search box
3. Search for **"FuelLogbookS3Policy"**
4. ✅ Check the box next to your policy
5. Click **"Next"**
6. Review and click **"Create user"**

**Alternative (Less Secure)**: You can use `AmazonS3FullAccess` for testing, but the custom policy above is more secure for production.

## Step 3: Create Access Keys

1. **Access the User**
   - Click on the newly created user `fuel-logbook-s3-user`

2. **Create Access Key**
   - Click on the "Security credentials" tab
   - Scroll down to "Access keys" section
   - Click "Create access key"
   - Select "Application running outside AWS"
   - Check the confirmation checkbox
   - Click "Next"
   - (Optional) Add a description tag: "Fuel Logbook App"
   - Click "Create access key"

3. **Save Your Credentials**
   - **IMPORTANT**: Copy both values immediately:
     - **Access key ID**: (looks like `AKIAIOSFODNN7EXAMPLE`)
     - **Secret access key**: (looks like `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY`)
   - Click "Download .csv file" to save them securely
   - **WARNING**: You cannot retrieve the secret access key again after closing this dialog!
   - Click "Done"

## Step 4: Add Environment Variables to Vercel

1. **Go to Your Vercel Project**
   - Open https://vercel.com/
   - Navigate to your Fuel Logbook project
   - Click on "Settings" tab
   - Click on "Environment Variables" in the left sidebar

2. **Add the Following Variables**:

   **Variable 1:**
   - Name: `AWS_ACCESS_KEY_ID`
   - Value: [Paste your Access key ID from Step 3]
   - Environment: Select all (Production, Preview, Development)
   - Click "Save"

   **Variable 2:**
   - Name: `AWS_SECRET_ACCESS_KEY`
   - Value: [Paste your Secret access key from Step 3]
   - Environment: Select all (Production, Preview, Development)
   - Click "Save"

   **Variable 3:**
   - Name: `AWS_REGION`
   - Value: `af-south-1` (or your chosen region)
   - Environment: Select all (Production, Preview, Development)
   - Click "Save"

   **Variable 4:**
   - Name: `AWS_S3_BUCKET_NAME`
   - Value: [Your bucket name from Step 1]
   - Environment: Select all (Production, Preview, Development)
   - Click "Save"

3. **Redeploy Your Application**
   - Go to the "Deployments" tab
   - Click the three dots on the latest deployment
   - Click "Redeploy"
   - This ensures the new environment variables are loaded

## Step 5: Test the Integration

### Test Receipt Upload

1. Open your deployed Fuel Logbook app
2. Add a new fuel entry
3. Upload a receipt image (JPEG or PNG)
4. You should see: ✅ "Receipt uploaded to AWS S3"

### Test Receipt Viewing (Signed URLs)

1. Go to your fuel log dashboard
2. Find an entry with a receipt
3. Click "View Receipt"
4. The receipt should open in a new tab
5. **Note**: The URL will be a signed URL that expires after 1 hour

### Verify in S3 Console

1. Go to [AWS S3 Console](https://s3.console.aws.amazon.com/)
2. Click on your bucket
3. Navigate to the `receipts/` folder
4. You should see uploaded files with `.avif` extension

---

## Understanding Signed URLs

### What Are Signed URLs?

Signed URLs are temporary, secure links generated by your app that allow access to private S3 objects.

### How It Works in Your App

1. **Upload**: Receipt is uploaded to private S3 bucket
2. **Storage**: S3 URL (without signature) is saved in database
3. **Viewing**: When you click "View Receipt", the app:
   - Extracts the S3 key from the stored URL
   - Generates a signed URL valid for 1 hour
   - Returns the signed URL to your browser
4. **Access**: Browser opens the signed URL to view the receipt
5. **Expiration**: After 1 hour, the URL expires

### Benefits

- ✅ **Security**: Bucket remains private, no public access
- ✅ **Temporary**: URLs expire automatically
- ✅ **Controlled**: Only your app can generate signed URLs
- ✅ **No CORS needed**: For basic viewing (CORS only needed for direct browser uploads)

---

## Troubleshooting

### Error: "Access Denied" when viewing receipts

**This was the original issue - now fixed with signed URLs!**

If you still see this error:
1. Verify your IAM policy includes `s3:GetObject` permission
2. Check that all 4 environment variables are set in Vercel
3. Ensure the bucket name and region match exactly
4. Redeploy your application after setting variables

### Error: "Access Denied" when uploading

**Cause**: IAM policy or credentials issue

**Solution**:
1. Verify the bucket name in your policy matches exactly
2. Check that environment variables are correct in Vercel
3. Ensure the IAM user has `s3:PutObject` permission
4. Redeploy your application

### Error: "Bucket Not Found"

**Cause**: Bucket name mismatch or wrong region

**Solution**:
1. Verify the bucket name is correct (no typos)
2. Check that the region matches your bucket's region
3. Bucket names are case-sensitive

### Error: "Invalid Credentials"

**Cause**: Wrong or expired access keys

**Solution**:
1. Go to IAM → Users → fuel-logbook-s3-user → Security credentials
2. Deactivate old access key
3. Create new access key
4. Update environment variables in Vercel
5. Redeploy

### Signed URLs expire too quickly

**Default**: URLs expire after 1 hour

**To change**: Edit `lib/s3-client.ts` and modify the `expiresIn` parameter:
\`\`\`typescript
// Change from 3600 (1 hour) to desired seconds
const signedUrl = await getSignedUrlForObject(key, 7200) // 2 hours
\`\`\`

---

## Optional: CORS Configuration (Only if needed)

**Note**: CORS is NOT required for basic receipt viewing with signed URLs. Only configure CORS if you need direct browser uploads or other cross-origin requests.

If needed, add this CORS configuration to your bucket:

1. Go to S3 → Your bucket → Permissions → CORS
2. Click "Edit"
3. Paste:

\`\`\`json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedOrigins": ["https://your-app.vercel.app"],
    "ExposeHeaders": []
  }
]
\`\`\`

4. Replace `your-app.vercel.app` with your actual domain
5. Click "Save changes"

---

## Cost Considerations

- **S3 Storage**: First 50 TB / month: $0.023 per GB (Cape Town region)
- **PUT Requests**: $0.005 per 1,000 requests
- **GET Requests**: $0.0004 per 1,000 requests (includes signed URL generation)
- For a personal fuel logbook, costs should be minimal (< $1/month)

---

## Security Best Practices

### ✅ What's Implemented

- ✅ Private bucket (no public access)
- ✅ IAM user with minimal permissions
- ✅ Server-side encryption (SSE-S3)
- ✅ Signed URLs for temporary access
- ✅ Automatic URL expiration

### 🔒 Additional Recommendations

1. **Rotate access keys** every 90 days
2. **Enable CloudTrail** to log all S3 access
3. **Set up S3 lifecycle rules** to archive old receipts
4. **Enable MFA** on your AWS root account
5. **Use custom policy** instead of AmazonS3FullAccess

---

## Next Steps

After completing this setup:

✅ Your S3 bucket is configured with secure signed URLs
✅ Receipts are stored privately and accessed securely
✅ No "Access Denied" errors when viewing receipts
✅ You can upload and view receipts in your Fuel Logbook app

**Optional enhancements:**
- Set up S3 lifecycle rules to archive old receipts to Glacier
- Enable S3 versioning for receipt history
- Configure CloudFront CDN for faster global delivery
- Adjust signed URL expiration time based on your needs
