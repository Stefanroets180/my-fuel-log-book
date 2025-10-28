import { sql } from "@/lib/db"
import { uploadToS3 } from "@/lib/s3-client"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    // Fetch all fuel entries
    const entries = await sql`
      SELECT * FROM fuel_entries 
      ORDER BY date DESC, created_at DESC
    `

    if (entries.length === 0) {
      return NextResponse.json({ error: "No fuel entries to export" }, { status: 400 })
    }

    // Calculate statistics
    const totalSpent = entries.reduce((sum: number, entry: any) => sum + Number(entry.total_cost), 0)
    const totalLiters = entries.reduce((sum: number, entry: any) => sum + Number(entry.liters), 0)
    const entriesWithKmL = entries.filter((e: any) => e.km_per_liter)
    const averageKmPerLiter =
      entriesWithKmL.reduce((sum: number, entry: any) => sum + Number(entry.km_per_liter), 0) / entriesWithKmL.length ||
      0
    const workTravelEntries = entries.filter((e: any) => e.is_work_travel)
    const workTravelCost = workTravelEntries.reduce((sum: number, entry: any) => sum + Number(entry.total_cost), 0)
    const totalDistance = entries.reduce((sum: number, entry: any) => sum + (Number(entry.distance_traveled) || 0), 0)

    // Prepare export data
    const exportData = {
      exportDate: new Date().toISOString(),
      summary: {
        totalEntries: entries.length,
        totalSpent: Number(totalSpent.toFixed(2)),
        totalLiters: Number(totalLiters.toFixed(2)),
        averageKmPerLiter: Number(averageKmPerLiter.toFixed(2)),
        totalDistance,
        workTravel: {
          entries: workTravelEntries.length,
          totalCost: Number(workTravelCost.toFixed(2)),
        },
      },
      entries: entries.map((entry: any) => ({
        id: entry.id,
        date: entry.date,
        odometerReading: entry.odometer_reading,
        liters: Number(entry.liters),
        pricePerLiter: Number(entry.price_per_liter),
        totalCost: Number(entry.total_cost),
        petrolStation: entry.petrol_station,
        receiptImageUrl: entry.receipt_image_url,
        isWorkTravel: entry.is_work_travel,
        kmPerLiter: entry.km_per_liter ? Number(entry.km_per_liter) : null,
        distanceTraveled: entry.distance_traveled,
        notes: entry.notes,
        createdAt: entry.created_at,
        updatedAt: entry.updated_at,
      })),
    }

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
    const filename = `fuel-logbook-exports/export-${timestamp}.json`

    // Upload to S3
    const result = await uploadToS3(filename, JSON.stringify(exportData, null, 2), "application/json")

    return NextResponse.json({
      success: true,
      message: "Data exported to S3 successfully",
      s3Location: {
        bucket: result.bucket,
        key: result.key,
        region: result.region,
      },
      summary: exportData.summary,
    })
  } catch (error: any) {
    console.error("Error exporting to S3:", error)

    // Check if it's an AWS configuration error
    if (error.message?.includes("AWS credentials not configured")) {
      return NextResponse.json(
        {
          error: "AWS S3 not configured",
          message: "Please set up AWS credentials in your environment variables. See AWS_S3_SETUP_INSTRUCTIONS.md",
        },
        { status: 400 },
      )
    }

    return NextResponse.json({ error: "Failed to export data to S3", details: error.message }, { status: 500 })
  }
}
