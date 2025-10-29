import { sql } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"
import { deleteFromS3 } from "@/lib/s3-client"

// DELETE a fuel entry
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    // Get the entry first to check if it has a receipt image
    const entries = await sql`
      SELECT receipt_image_url FROM fuel_entries WHERE id = ${id}
    `

    if (entries.length === 0) {
      return NextResponse.json({ error: "Fuel entry not found" }, { status: 404 })
    }

    const entry = entries[0]

    if (entry.receipt_image_url) {
      try {
        await deleteFromS3(entry.receipt_image_url)
      } catch (error) {
        console.error("Error deleting receipt image from S3:", error)
        // Continue with entry deletion even if image deletion fails
      }
    }

    // Delete the entry
    await sql`DELETE FROM fuel_entries WHERE id = ${id}`

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting fuel entry:", error)
    return NextResponse.json({ error: "Failed to delete fuel entry" }, { status: 500 })
  }
}
