import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
    console.log("[v0] Receipt upload request received")

    try {
        const formData = await request.formData()
        const file = formData.get("file") as File

        if (!file) {
            console.log("[v0] No file provided in request")
            return NextResponse.json({ error: "No file provided" }, { status: 400 })
        }

        console.log("[v0] File received:", {
            name: file.name,
            size: file.size,
            type: file.type,
        })

        // Upload to Vercel Blob with a unique filename
        const timestamp = Date.now()
        const filename = `receipts/${timestamp}-${file.name}`

        console.log("[v0] Uploading to Blob storage:", filename)

        const blob = await put(filename, file, {
            access: "public",
        })

        console.log("[v0] Upload successful:", blob.url)

        return NextResponse.json({
            url: blob.url,
            filename: file.name,
            size: file.size,
            type: file.type,
        })
    } catch (error) {
        console.error("[v0] Upload error:", error)
        return NextResponse.json(
            { error: "Upload failed", details: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 },
        )
    }
}
