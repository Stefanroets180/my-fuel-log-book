import { sql } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"
import { del } from "@vercel/blob"

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

    // Delete the receipt image from Blob if it exists
    if (entry.receipt_image_url) {
      try {
        await del(entry.receipt_image_url)
      } catch (error) {
        console.error("[v0] Error deleting receipt image:", error)
        // Continue with entry deletion even if image deletion fails
      }
    }

    // Delete the entry
    await sql`DELETE FROM fuel_entries WHERE id = ${id}`

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting fuel entry:", error)
    return NextResponse.json({ error: "Failed to delete fuel entry" }, { status: 500 })
  }
}
