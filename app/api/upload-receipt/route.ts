import { type NextRequest, NextResponse } from "next/server"
import { getS3Client, getBucketName } from "@/lib/s3-client"
import { PutObjectCommand } from "@aws-sdk/client-s3"
import sharp from "sharp"

export async function POST(request: NextRequest) {
    console.log("Receipt upload request received")

    try {
        const formData = await request.formData()
        const file = formData.get("file") as File

        if (!file) {
            console.log("No file provided in request")
            return NextResponse.json({ error: "No file provided" }, { status: 400 })
        }

        console.log("File received:", {
            name: file.name,
            size: file.size,
            type: file.type,
        })

        // Validate file type
        if (!file.type.startsWith("image/")) {
            return NextResponse.json({ error: "File must be an image" }, { status: 400 })
        }

        // Convert file to buffer
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        console.log("Converting image to AVIF format")

        const avifBuffer = await sharp(buffer)
            .avif({
                quality: 80, // Good balance between quality and file size
                effort: 4, // Compression effort (0-9, higher = smaller file but slower)
            })
            .toBuffer()

        console.log("Conversion complete. Original size:", buffer.length, "AVIF size:", avifBuffer.length)

        const s3Client = getS3Client()
        const bucketName = getBucketName()

        // Generate unique filename with timestamp
        const timestamp = Date.now()
        const originalName = file.name.replace(/\.[^/.]+$/, "") // Remove extension
        const filename = `receipts/${timestamp}-${originalName}.avif`

        console.log("Uploading to S3:", filename)

        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: filename,
            Body: avifBuffer,
            ContentType: "image/avif",
            Metadata: {
                originalName: file.name,
                originalSize: buffer.length.toString(),
                convertedSize: avifBuffer.length.toString(),
                uploadDate: new Date().toISOString(),
            },
        })

        await s3Client.send(command)

        // Construct the S3 URL
        const region = process.env.AWS_REGION
        const url = `https://${bucketName}.s3.${region}.amazonaws.com/${filename}`

        console.log("[v0] Upload successful:", url)

        return NextResponse.json({
            url,
            filename: `${originalName}.avif`,
            originalSize: buffer.length,
            convertedSize: avifBuffer.length,
            compressionRatio: ((1 - avifBuffer.length / buffer.length) * 100).toFixed(1) + "%",
            type: "image/avif",
        })
    } catch (error) {
        console.error("Upload error:", error)
        return NextResponse.json(
            {
                error: "Upload failed",
                details: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 },
        )
    }
}
