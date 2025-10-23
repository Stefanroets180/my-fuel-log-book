"use client"

import { useState } from "react"
import { FuelEntryForm } from "@/components/fuel-entry-form"
import { FuelLogDashboard } from "@/components/fuel-log-dashboard"
import { ExportEmailDialog } from "@/components/export-email-dialog"
import { ExportS3Dialog } from "@/components/export-s3-dialog"

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0)

  const handleEntryAdded = () => {
    setRefreshKey((prev) => prev + 1)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Fuel Logbook</h1>
            <p className="text-muted-foreground mt-2">Track your vehicle's fuel consumption and expenses</p>
          </div>
          <div className="flex gap-2">
            <ExportEmailDialog />
            <ExportS3Dialog />
          </div>
        </div>

        <div className="space-y-8">
          <FuelEntryForm onSuccess={handleEntryAdded} />
          <FuelLogDashboard refreshKey={refreshKey} />
        </div>
      </div>
    </div>
  )
}
