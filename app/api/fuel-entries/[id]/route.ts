import { sql } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"
import { deleteFromS3 } from "@/lib/s3-client"

// DELETE a fuel entry
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    // Get the entry first to check if it has a receipt image and if it's locked
    const entries = await sql`
      SELECT receipt_image_url, is_locked FROM fuel_entries WHERE id = ${id}
    `

    if (entries.length === 0) {
      return NextResponse.json({ error: "Fuel entry not found" }, { status: 404 })
    }

    const entry = entries[0]

    // Prevent deletion if entry is locked
    if (entry.is_locked) {
      return NextResponse.json({ error: "Cannot delete locked entry. Unlock it first to delete." }, { status: 403 })
    }

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

// PATCH to toggle lock status
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { is_locked } = body

    if (typeof is_locked !== "boolean") {
      return NextResponse.json({ error: "is_locked must be a boolean" }, { status: 400 })
    }

    const result = await sql`
      UPDATE fuel_entries 
      SET is_locked = ${is_locked}, updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Fuel entry not found" }, { status: 404 })
    }

    return NextResponse.json({ entry: result[0] })
  } catch (error) {
    console.error("Error updating fuel entry lock status:", error)
    return NextResponse.json({ error: "Failed to update lock status" }, { status: 500 })
  }
}
