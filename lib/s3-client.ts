import {
  S3Client,
  PutObjectCommand,
  ListObjectsV2Command,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

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

export async function getSignedUrlForObject(key: string, expiresIn = 3600) {
  const client = getS3Client()
  const bucketName = getBucketName()

  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  })

  // Generate a signed URL that expires after the specified time (default 1 hour)
  const signedUrl = await getSignedUrl(client, command, { expiresIn })
  return signedUrl
}

export function extractS3KeyFromUrl(url: string): string {
  const bucketName = getBucketName()
  const region = process.env.AWS_REGION

  // URL format: https://bucket-name.s3.region.amazonaws.com/key
  const urlPattern = new RegExp(`https://${bucketName}\\.s3\\.${region}\\.amazonaws\\.com/(.+)`)
  const match = url.match(urlPattern)

  if (!match) {
    throw new Error("Invalid S3 URL format")
  }

  return decodeURIComponent(match[1])
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

export async function deleteFromS3(url: string) {
  const client = getS3Client()
  const bucketName = getBucketName()

  const key = extractS3KeyFromUrl(url)

  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: key,
  })

  await client.send(command)

  return { bucket: bucketName, key, deleted: true }
}
