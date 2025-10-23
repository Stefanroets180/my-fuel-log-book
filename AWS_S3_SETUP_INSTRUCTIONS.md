# AWS S3 Setup Instructions (via IAM Dashboard)

Follow these step-by-step instructions to set up AWS S3 for your Fuel Logbook app without using the AWS CLI.

## Step 1: Create an S3 Bucket

1. **Log in to AWS Console**
   - Go to https://console.aws.amazon.com/
   - Sign in with your AWS account credentials

2. **Navigate to S3**
   - In the search bar at the top, type "S3"
   - Click on "S3" from the results

3. **Create a New Bucket**
   - Click the orange "Create bucket" button
   - **Bucket name**: Enter a unique name (e.g., `fuel-logbook-exports-yourname`)
     - Must be globally unique across all AWS accounts
     - Use lowercase letters, numbers, and hyphens only
   - **AWS Region**: Choose your preferred region (e.g., `af-south-1` for Cape Town)
   - **Object Ownership**: Keep "ACLs disabled (recommended)"
   - **Block Public Access**: Keep all checkboxes CHECKED (block all public access)
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
   - In the search box, type "S3"
   - Find and check the box for **"AmazonS3FullAccess"**
     - Note: For production, you should create a custom policy with minimal permissions
   - Click "Next"
   - Review and click "Create user"

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

1. Once your app is redeployed, try exporting data to S3
2. Check your S3 bucket in the AWS Console to verify the file was uploaded
3. Navigate to S3 → Your bucket → You should see a new file with timestamp

## Security Best Practices (Optional but Recommended)

### Create a Custom IAM Policy (More Secure)

Instead of using `AmazonS3FullAccess`, create a custom policy:

1. **Go to IAM → Policies**
2. Click "Create policy"
3. Click "JSON" tab
4. Paste this policy (replace `YOUR-BUCKET-NAME`):

\`\`\`json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::YOUR-BUCKET-NAME",
        "arn:aws:s3:::YOUR-BUCKET-NAME/*"
      ]
    }
  ]
}
\`\`\`

5. Click "Next"
6. Name it `FuelLogbookS3Policy`
7. Click "Create policy"
8. Go back to your IAM user and attach this policy instead

## Troubleshooting

**Error: Access Denied**
- Check that your AWS credentials are correct in Vercel
- Verify the IAM user has the correct permissions
- Ensure the bucket name matches exactly

**Error: Bucket Not Found**
- Verify the bucket name is correct (no typos)
- Check that the region matches your bucket's region

**Error: Invalid Credentials**
- Regenerate access keys in IAM
- Update the environment variables in Vercel
- Redeploy your application

## Cost Considerations

- **S3 Storage**: First 50 TB / month: $0.023 per GB (Cape Town region)
- **PUT Requests**: $0.005 per 1,000 requests
- **GET Requests**: $0.0004 per 1,000 requests
- For a personal fuel logbook, costs should be minimal (< $1/month)

## Next Steps

After completing this setup, you can use the "Export to S3" feature in your Fuel Logbook app to automatically backup your data to AWS S3.
