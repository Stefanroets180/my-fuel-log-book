import { createClient } from '@/lib/supabase/server'
import { sql } from '@/lib/db'
import { NextResponse } from 'next/server'

// GET single car
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    
      const result = await sql`
      SELECT * FROM cars 
      WHERE id = ${id} AND user_id = ${user.id}
    `

    if (result.length === 0) {
      return NextResponse.json({ error: 'Car not found' }, { status: 404 })
    }

    return NextResponse.json({ car: result[0] })
  } catch (error) {
    console.error('Error fetching car:', error)
    return NextResponse.json({ error: 'Failed to fetch car' }, { status: 500 })
  }
}

// PUT update car
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { make, model, year, registration_number, is_default } = body

    // Verify car belongs to user
    const existing = await sql`
      SELECT * FROM cars 
      WHERE id = ${id} AND user_id = ${user.id}
    `

    if (existing.length === 0) {
      return NextResponse.json({ error: 'Car not found' }, { status: 404 })
    }

    // If setting as default, unset other defaults
    if (is_default) {
      await sql`
        UPDATE cars 
        SET is_default = FALSE 
        WHERE user_id = ${user.id} AND id != ${id}
      `
    }

    // Update car
    const result = await sql`
      UPDATE cars 
      SET 
        make = ${make},
        model = ${model},
        year = ${year || null},
        registration_number = ${registration_number || null},
        is_default = ${is_default || false},
        updated_at = NOW()
      WHERE id = ${id} AND user_id = ${user.id}
      RETURNING *
    `

    return NextResponse.json({ car: result[0] })
  } catch (error: any) {
    console.error('Error updating car:', error)
    
    if (error.message?.includes('unique constraint')) {
      return NextResponse.json(
        { error: 'A car with this registration number already exists' },
        { status: 409 }
      )
    }
    
    return NextResponse.json({ error: 'Failed to update car' }, { status: 500 })
  }
}

// DELETE car
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if car has fuel entries
    const entries = await sql`
      SELECT COUNT(*) as count 
      FROM fuel_entries 
      WHERE car_id = ${id} AND user_id = ${user.id}
    `

    if (entries[0].count > 0) {
      return NextResponse.json(
        { 
          error: 'Cannot delete car with existing fuel entries',
          details: `This car has ${entries[0].count} fuel entries. Please delete or reassign them first.`
        },
        { status: 409 }
      )
    }

    // Delete car
    const result = await sql`
      DELETE FROM cars 
      WHERE id = ${id} AND user_id = ${user.id}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: 'Car not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Car deleted successfully' })
  } catch (error) {
    console.error('Error deleting car:', error)
    return NextResponse.json({ error: 'Failed to delete car' }, { status: 500 })
  }
}


/*
// Placeholder API when Supabase is not installed
import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({ error: "Authentication not configured" }, { status: 503 })
}

export async function PUT() {
  return NextResponse.json({ error: "Authentication not configured" }, { status: 503 })
}

export async function DELETE() {
  return NextResponse.json({ error: "Authentication not configured" }, { status: 503 })
}
*/
