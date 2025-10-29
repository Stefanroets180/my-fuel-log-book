"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Cloud, Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function ExportS3Dialog() {
  const [open, setOpen] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [exportResult, setExportResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleExport = async () => {
    setIsExporting(true)
    setError(null)
    setExportResult(null)

    try {
      const response = await fetch("/api/export-s3", {
        method: "POST",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || data.error || "Export failed")
      }

      setExportResult(data)
    } catch (error: any) {
      console.error("Export error:", error)
      setError(error.message || "Failed to export data to S3. Please try again.")
    } finally {
      setIsExporting(false)
    }
  }

  const handleClose = () => {
    setOpen(false)
    setExportResult(null)
    setError(null)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 bg-transparent">
          <Cloud className="h-4 w-4" />
          Backup to S3
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export to AWS S3</DialogTitle>
          <DialogDescription>
            Backup all your fuel logbook data to AWS S3 for secure cloud storage and long-term archival.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Export Failed</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {exportResult && (
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Export Successful!</AlertTitle>
              <AlertDescription>
                <div className="mt-2 space-y-1 text-sm">
                  <p>
                    <strong>Bucket:</strong> {exportResult.s3Location.bucket}
                  </p>
                  <p>
                    <strong>File:</strong> {exportResult.s3Location.key}
                  </p>
                  <p>
                    <strong>Region:</strong> {exportResult.s3Location.region}
                  </p>
                  <div className="mt-3 pt-3 border-t">
                    <p className="font-semibold mb-1">Export Summary:</p>
                    <p>Total Entries: {exportResult.summary.totalEntries}</p>
                    <p>Total Spent: R {exportResult.summary.totalSpent.toFixed(2)}</p>
                    <p>Work Travel Entries: {exportResult.summary.workTravel.entries}</p>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {!exportResult && !error && (
            <div className="text-sm text-muted-foreground space-y-2">
              <p>This will create a JSON backup of all your fuel entries including:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>All fuel entry records</li>
                <li>Summary statistics</li>
                <li>Work travel data for SARS</li>
                <li>Consumption metrics</li>
              </ul>
              <p className="mt-3 text-xs">
                Note: Receipt images are stored in AWS S3 under the receipts/ folder and are not included in this JSON
                backup.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          {exportResult ? (
            <Button onClick={handleClose}>Close</Button>
          ) : (
            <>
              <Button variant="outline" onClick={handleClose} disabled={isExporting}>
                Cancel
              </Button>
              <Button onClick={handleExport} disabled={isExporting} className="gap-2">
                {isExporting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Cloud className="h-4 w-4" />
                    Export to S3
                  </>
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
