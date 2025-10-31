import { createClient } from '@/lib/supabase/server'
import { sql } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"
import { deleteFromS3 } from "@/lib/s3-client"

// DELETE a fuel entry
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        // Step 1: Create Supabase client
        const supabase = await createClient()

        // Step 2: Get the authenticated user
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        // Step 3: Check if user is authenticated
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = await params

        // Step 4: Get the entry and verify ownership
        const entries = await sql`
      SELECT receipt_image_url, is_locked, user_id 
      FROM fuel_entries 
      WHERE id = ${id}
    `

        if (entries.length === 0) {
            return NextResponse.json({ error: "Fuel entry not found" }, { status: 404 })
        }

        const entry = entries[0]

        // Step 5: Verify the entry belongs to the current user
        if (entry.user_id !== user.id) {
            return NextResponse.json({ error: "Forbidden: You don't have permission to delete this entry" }, { status: 403 })
        }

        // Prevent deletion if entry is locked
        if (entry.is_locked) {
            return NextResponse.json({ error: "Cannot delete locked entry. Unlock it first to delete." }, { status: 403 })
        }

        // Delete receipt image from S3 if exists
        if (entry.receipt_image_url) {
            try {
                await deleteFromS3(entry.receipt_image_url)
            } catch (error) {
                console.error("Error deleting receipt image from S3:", error)
                // Continue with entry deletion even if image deletion fails
            }
        }

        // Step 6: Delete the entry (already verified ownership)
        await sql`DELETE FROM fuel_entries WHERE id = ${id} AND user_id = ${user.id}`

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error deleting fuel entry:", error)
        return NextResponse.json({ error: "Failed to delete fuel entry" }, { status: 500 })
    }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        // Step 1: Create Supabase client
        const supabase = await createClient()

        // Step 2: Get the authenticated user
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        // Step 3: Check if user is authenticated
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = await params
        const body = await request.json()
        const { is_locked } = body

        if (typeof is_locked !== "boolean") {
            return NextResponse.json({ error: "is_locked must be a boolean" }, { status: 400 })
        }

        // Step 4: Update only if entry belongs to current user
        const result = await sql`
            UPDATE fuel_entries
            SET is_locked = ${is_locked}, updated_at = NOW()
            WHERE id = ${id} AND user_id = ${user.id}
                RETURNING *
        `

        if (result.length === 0) {
            return NextResponse.json({ error: "Fuel entry not found or you don't have permission to modify it" }, { status: 404 })
        }

        return NextResponse.json({ entry: result[0] })
    } catch (error) {
        console.error("Error updating fuel entry lock status:", error)
        return NextResponse.json({ error: "Failed to update lock status" }, { status: 500 })
    }
}