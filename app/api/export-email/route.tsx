import { sql } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email address is required" }, { status: 400 })
    }

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

    // Generate HTML email
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
    h1 { color: #2563eb; border-bottom: 3px solid #2563eb; padding-bottom: 10px; }
    h2 { color: #1e40af; margin-top: 30px; }
    .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 20px 0; }
    .stat-card { background: #f3f4f6; padding: 15px; border-radius: 8px; border-left: 4px solid #2563eb; }
    .stat-label { font-size: 12px; color: #6b7280; text-transform: uppercase; }
    .stat-value { font-size: 24px; font-weight: bold; color: #1f2937; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th { background: #2563eb; color: white; padding: 12px; text-align: left; }
    td { padding: 10px; border-bottom: 1px solid #e5e7eb; }
    tr:hover { background: #f9fafb; }
    .work-badge { background: #10b981; color: white; padding: 2px 8px; border-radius: 4px; font-size: 11px; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #e5e7eb; color: #6b7280; font-size: 12px; }
  </style>
</head>
<body>
  <h1>Fuel Logbook Report</h1>
  <p>Generated on ${new Date().toLocaleDateString("en-ZA", { year: "numeric", month: "long", day: "numeric" })}</p>
  
  <h2>Summary Statistics</h2>
  <div class="stats">
    <div class="stat-card">
      <div class="stat-label">Total Spent</div>
      <div class="stat-value">R ${totalSpent.toFixed(2)}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Total Liters</div>
      <div class="stat-value">${totalLiters.toFixed(1)} L</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Avg. Consumption</div>
      <div class="stat-value">${averageKmPerLiter.toFixed(1)} km/L</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Work Travel Cost</div>
      <div class="stat-value">R ${workTravelCost.toFixed(2)}</div>
    </div>
  </div>

  <h2>Fuel Entries (${entries.length} total)</h2>
  <table>
    <thead>
      <tr>
        <th>Date</th>
        <th>Odometer</th>
        <th>Liters</th>
        <th>Price/L</th>
        <th>Total</th>
        <th>km/L</th>
        <th>Station</th>
        <th>Type</th>
      </tr>
    </thead>
    <tbody>
      ${entries
        .map(
          (entry: any) => `
        <tr>
          <td>${new Date(entry.date).toLocaleDateString("en-ZA")}</td>
          <td>${entry.odometer_reading.toLocaleString()} km</td>
          <td>${Number(entry.liters).toFixed(2)} L</td>
          <td>R ${Number(entry.price_per_liter).toFixed(2)}</td>
          <td><strong>R ${Number(entry.total_cost).toFixed(2)}</strong></td>
          <td>${entry.km_per_liter ? Number(entry.km_per_liter).toFixed(2) : "-"}</td>
          <td>${entry.petrol_station || "-"}</td>
          <td>${entry.is_work_travel ? '<span class="work-badge">WORK</span>' : "Personal"}</td>
        </tr>
      `,
        )
        .join("")}
    </tbody>
  </table>

  <h2>Work Travel Summary (SARS)</h2>
  <p><strong>Total Work Travel Entries:</strong> ${workTravelEntries.length}</p>
  <p><strong>Total Work Travel Cost:</strong> R ${workTravelCost.toFixed(2)}</p>
  <p style="font-size: 12px; color: #6b7280;">This summary can be used for South African Revenue Service (SARS) tax purposes.</p>

  <div class="footer">
    <p>This report was generated from your Fuel Logbook application.</p>
    <p>Keep this email for your records and tax documentation.</p>
  </div>
</body>
</html>
    `

    // For now, we'll use a simple email sending approach
    // In production, you would integrate with a service like Resend, SendGrid, or AWS SES
    // Since we don't have email service configured, we'll return the HTML for manual sending
    // or you can integrate with your preferred email service

    // Example with Resend (commented out - requires RESEND_API_KEY):
    /*
    const { Resend } = require('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    await resend.emails.send({
      from: 'Fuel Logbook <noreply@yourdomain.com>',
      to: email,
      subject: 'Your Fuel Logbook Report',
      html: emailHtml,
    });
    */

    // For now, return success with the HTML (you can view it or implement email service)
    return NextResponse.json({
      success: true,
      message: "Email export prepared successfully",
      html: emailHtml,
      stats: {
        totalEntries: entries.length,
        totalSpent,
        totalLiters,
        averageKmPerLiter,
        workTravelCost,
      },
    })
  } catch (error) {
    console.error("[v0] Error exporting to email:", error)
    return NextResponse.json({ error: "Failed to export data" }, { status: 500 })
  }
}
