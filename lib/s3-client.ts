import { S3Client, PutObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3"

// Create S3 client singleton
let s3Client: S3Client | null = null

export function getS3Client() {
  if (!s3Client) {
    // Check if AWS credentials are configured
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.AWS_REGION) {
      throw new Error("AWS credentials not configured. Please set up AWS environment variables.")
    }

    s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    })
  }

  return s3Client
}

export function getBucketName() {
  const bucketName = process.env.AWS_S3_BUCKET_NAME
  if (!bucketName) {
    throw new Error("AWS_S3_BUCKET_NAME environment variable is not set")
  }
  return bucketName
}

export async function uploadToS3(key: string, body: string | Buffer, contentType = "application/json") {
  const client = getS3Client()
  const bucketName = getBucketName()

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: body,
    ContentType: contentType,
  })

  await client.send(command)

  return {
    bucket: bucketName,
    key,
    region: process.env.AWS_REGION,
  }
}

export async function listS3Objects(prefix?: string) {
  const client = getS3Client()
  const bucketName = getBucketName()

  const command = new ListObjectsV2Command({
    Bucket: bucketName,
    Prefix: prefix,
  })

  const response = await client.send(command)
  return response.Contents || []
}
