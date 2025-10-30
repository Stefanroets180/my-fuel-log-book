/*import { createClient } from '@/lib/supabase/server'
import { sql } from '@/lib/db'
import { NextResponse } from 'next/server'

// GET all cars for the current user
export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // @ts-ignore
      const cars = await sql`
      SELECT * FROM cars 
      WHERE user_id = ${user.id}
      ORDER BY is_default DESC, created_at DESC
    `

    return NextResponse.json({ cars })
  } catch (error) {
    console.error('Error fetching cars:', error)
    return NextResponse.json({ error: 'Failed to fetch cars' }, { status: 500 })
  }
}

// POST create new car
export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { make, model, year, registration_number, is_default } = body

    // Validate required fields
    if (!make || !model) {
      return NextResponse.json(
        { error: 'Make and model are required' },
        { status: 400 }
      )
    }

    // If this is set as default, unset other defaults
    if (is_default) {
      await sql`
        UPDATE cars 
        SET is_default = FALSE 
        WHERE user_id = ${user.id}
      `
    }

    // Insert new car
    const result = await sql`
      INSERT INTO cars (
        user_id,
        make,
        model,
        year,
        registration_number,
        is_default
      ) VALUES (
        ${user.id},
        ${make},
        ${model},
        ${year || null},
        ${registration_number || null},
        ${is_default || false}
      )
      RETURNING *
    `

    return NextResponse.json({ car: result[0] }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating car:', error)
    
    // Handle unique constraint violation
    if (error.message?.includes('unique constraint')) {
      return NextResponse.json(
        { error: 'A car with this registration number already exists' },
        { status: 409 }
      )
    }
    
    return NextResponse.json({ error: 'Failed to create car' }, { status: 500 })
  }
}*/


// Placeholder API when Supabase is not installed
import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json(
    { error: "Authentication not configured. Please follow SUPABASE_AUTHENTICATION_SETUP.md" },
    { status: 503 },
  )
}

export async function POST() {
  return NextResponse.json(
    { error: "Authentication not configured. Please follow SUPABASE_AUTHENTICATION_SETUP.md" },
    { status: 503 },
  )
}
