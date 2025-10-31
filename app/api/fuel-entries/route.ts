import { createClient } from '@/lib/supabase/server'
import { sql } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

// GET all fuel entries
export async function GET() {
    try {
        // Step 1: Create Supabase client
        const supabase = await createClient()

        // Step 2: Get the authenticated user
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        // Step 3: Check if user is authenticated
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        console.log("Fetching fuel entries for user:", user.id)

        try {
            // Step 4: Query database filtered by user_id
            const entries = await sql`
                SELECT * FROM fuel_entries
                WHERE user_id = ${user.id}
                ORDER BY date DESC, created_at DESC
            `

            console.log("Successfully fetched", entries.length, "entries")
            return NextResponse.json({ entries })
        } catch (dbError: any) {
            // Check if error is due to missing table
            if (dbError.message?.includes("relation") && dbError.message?.includes("does not exist")) {
                console.error("Table 'fuel_entries' does not exist")
                return NextResponse.json(
                    {
                        error: "Database not initialized",
                        details: "The fuel_entries table does not exist. Please run the database migration script.",
                        setupRequired: true,
                    },
                    { status: 503 },
                )
            }
            throw dbError
        }
    } catch (error) {
        console.error("Error fetching fuel entries:", error)
        const errorMessage = error instanceof Error ? error.message : "Unknown error"
        return NextResponse.json(
            {
                error: "Failed to fetch fuel entries",
                details: errorMessage,
            },
            { status: 500 },
        )
    }
}

// POST create new fuel entry
export async function POST(request: NextRequest) {
    try {
        // Step 1: Create Supabase client
        const supabase = await createClient()

        // Step 2: Get the authenticated user
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        // Step 3: Check if user is authenticated
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const {
            date,
            odometer_reading,
            liters,
            price_per_liter,
            petrol_station,
            receipt_image_url,
            is_work_travel,
            work_distance_km,
            notes,
        } = body

        // Calculate total cost
        const total_cost = liters * price_per_liter

        // Step 4: Get previous entry for THIS USER ONLY to calculate km/L
        const previousEntries = await sql`
      SELECT odometer_reading, date 
      FROM fuel_entries 
      WHERE user_id = ${user.id} AND date < ${date}
      ORDER BY date DESC 
      LIMIT 1
    `

        let km_per_liter = null
        let distance_traveled = null

        if (previousEntries.length > 0) {
            const previousReading = previousEntries[0].odometer_reading
            distance_traveled = odometer_reading - previousReading

            if (distance_traveled > 0 && liters > 0) {
                km_per_liter = distance_traveled / liters
            }
        }

        // Step 5: Insert new entry with user_id
        const result = await sql`
            INSERT INTO fuel_entries (
                user_id,
                date,
                odometer_reading,
                liters,
                price_per_liter,
                total_cost,
                petrol_station,
                receipt_image_url,
                is_work_travel,
                km_per_liter,
                distance_traveled,
                work_distance_km,
                is_locked,
                notes
            ) VALUES (
                         ${user.id},
                         ${date},
                         ${odometer_reading},
                         ${liters},
                         ${price_per_liter},
                         ${total_cost},
                         ${petrol_station || null},
                         ${receipt_image_url || null},
                         ${is_work_travel},
                         ${km_per_liter},
                         ${distance_traveled},
                         ${work_distance_km || null},
                         ${false},
                         ${notes || null}
                     )
                RETURNING *
        `

        return NextResponse.json({ entry: result[0] }, { status: 201 })
    } catch (error) {
        console.error("Error creating fuel entry:", error)
        return NextResponse.json({ error: "Failed to create fuel entry" }, { status: 500 })
    }
}
