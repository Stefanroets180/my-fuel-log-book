import { type NextRequest, NextResponse } from "next/server"
import { getSignedUrlForObject, extractS3KeyFromUrl } from "@/lib/s3-client"

// API route to generate signed URLs for viewing receipts
export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    console.log("[v0] Generating signed URL for:", url)

    // Extract the S3 key from the URL
    const key = extractS3KeyFromUrl(url)

    // Generate a signed URL that expires in 1 hour
    const signedUrl = await getSignedUrlForObject(key, 3600)

    console.log("[v0] Signed URL generated successfully")

    return NextResponse.json({ signedUrl })
  } catch (error) {
    console.error("[v0] Error generating signed URL:", error)
    return NextResponse.json(
      {
        error: "Failed to generate signed URL",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
