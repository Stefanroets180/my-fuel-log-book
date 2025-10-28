"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Trash2, Briefcase, ImageIcon, ExternalLink, AlertCircle } from "lucide-react"
import type { FuelEntry } from "@/lib/types"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface FuelLogDashboardProps {
    refreshKey?: number
}

export function FuelLogDashboard({ refreshKey }: FuelLogDashboardProps) {
    const [entries, setEntries] = useState<FuelEntry[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [deletingId, setDeletingId] = useState<number | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [setupRequired, setSetupRequired] = useState(false)

    const fetchEntries = async () => {
        try {
            console.log("Fetching entries from API...")
            const response = await fetch("/api/fuel-entries")

            console.log("Response status:", response.status)

            const contentType = response.headers.get("content-type")
            if (!response.ok) {
                if (contentType?.includes("application/json")) {
                    const errorData = await response.json()
                    console.error("API error:", errorData)
                    setSetupRequired(errorData.setupRequired || false)
                    throw new Error(errorData.details || errorData.error || "Failed to fetch entries")
                } else {
                    const errorText = await response.text()
                    console.error("Non-JSON error response:", errorText)
                    throw new Error("Server error: Unable to connect to database. Please check your Neon configuration.")
                }
            }

            const data = await response.json()
            console.log("Received data:", data)
            setEntries(data.entries)
            setError(null)
            setSetupRequired(false)
        } catch (error) {
            console.error("Error fetching entries:", error)
            setError(error instanceof Error ? error.message : "Failed to fetch entries")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchEntries()
    }, [refreshKey])

    const handleDelete = async (id: number) => {
        setDeletingId(id)
        try {
            const response = await fetch(`/api/fuel-entries/${id}`, {
                method: "DELETE",
            })

            if (!response.ok) throw new Error("Failed to delete entry")

            setEntries((prev) => prev.filter((entry) => entry.id !== id))
        } catch (error) {
            console.error("Error deleting entry:", error)
            alert("Failed to delete entry. Please try again.")
        } finally {
            setDeletingId(null)
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-ZA", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }

    const formatCurrency = (amount: number) => {
        return `R ${amount.toFixed(2)}`
    }

    const totalSpent = entries.reduce((sum, entry) => sum + Number(entry.total_cost), 0)
    const totalLiters = entries.reduce((sum, entry) => sum + Number(entry.liters), 0)
    const averageKmPerLiter =
        entries.filter((e) => e.km_per_liter).reduce((sum, entry) => sum + Number(entry.km_per_liter), 0) /
        entries.filter((e) => e.km_per_liter).length || 0
    const workTravelEntries = entries.filter((e) => e.is_work_travel).length

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    if (error) {
        return (
            <Card className="border-destructive">
                <CardHeader>
                    <CardTitle className="text-destructive flex items-center gap-2">
                        <AlertCircle className="h-5 w-5" />
                        {setupRequired ? "Database Setup Required" : "Database Error"}
                    </CardTitle>
                    <CardDescription>
                        {setupRequired
                            ? "The database table needs to be created before you can use the app."
                            : "Unable to load fuel entries. Please check your database configuration."}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error Details</AlertTitle>
                        <AlertDescription className="font-mono text-xs mt-2">{error}</AlertDescription>
                    </Alert>

                    <div className="space-y-3 rounded-lg bg-muted p-4">
                        <p className="text-sm font-semibold">Setup Instructions:</p>
                        <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                            <li>
                                Open the <code className="bg-background px-1.5 py-0.5 rounded text-xs">scripts</code> folder in your
                                project
                            </li>
                            <li>
                                Locate the file:{" "}
                                <code className="bg-background px-1.5 py-0.5 rounded text-xs">001_create_fuel_entries_table.sql</code>
                            </li>
                            <li>
                                Go to your{" "}
                                <a
                                    href="https://console.neon.tech"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline"
                                >
                                    Neon Console
                                </a>
                            </li>
                            <li>Select your project and navigate to the SQL Editor</li>
                            <li>Copy and paste the SQL script content into the editor</li>
                            <li>Click "Run" to create the fuel_entries table</li>
                            <li>Return here and click the "Retry Connection" button below</li>
                        </ol>
                    </div>

                    <div className="space-y-2 rounded-lg bg-muted p-4">
                        <p className="text-sm font-semibold">Environment Variables Check:</p>
                        <p className="text-xs text-muted-foreground">
                            Make sure <code className="bg-background px-1.5 py-0.5 rounded">NEON_NEON_DATABASE_URL</code> is set in
                            your Vercel project settings or local .env file.
                        </p>
                    </div>

                    <Button
                        onClick={() => {
                            setIsLoading(true)
                            setError(null)
                            fetchEntries()
                        }}
                        className="w-full"
                    >
                        Retry Connection
                    </Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="pb-3">
                        <CardDescription>Total Spent</CardDescription>
                        <CardTitle className="text-3xl">{formatCurrency(totalSpent)}</CardTitle>
                    </CardHeader>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardDescription>Total Liters</CardDescription>
                        <CardTitle className="text-3xl">{totalLiters.toFixed(1)} L</CardTitle>
                    </CardHeader>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardDescription>Avg. Consumption</CardDescription>
                        <CardTitle className="text-3xl">{averageKmPerLiter.toFixed(1)} km/L</CardTitle>
                    </CardHeader>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardDescription>Work Travel</CardDescription>
                        <CardTitle className="text-3xl">{workTravelEntries}</CardTitle>
                    </CardHeader>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Fuel Entries</CardTitle>
                    <CardDescription>Your complete fuel purchase history</CardDescription>
                </CardHeader>
                <CardContent>
                    {entries.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">
                            No fuel entries yet. Add your first entry to get started!
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {entries.map((entry) => (
                                <div
                                    key={entry.id}
                                    className="flex flex-col gap-4 rounded-lg border border-border p-4 hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 space-y-2">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="font-semibold text-lg">{formatDate(entry.date)}</span>
                                                {entry.is_work_travel && (
                                                    <Badge variant="secondary" className="gap-1">
                                                        <Briefcase className="h-3 w-3" />
                                                        Work Travel
                                                    </Badge>
                                                )}
                                                {entry.petrol_station && <Badge variant="outline">{entry.petrol_station}</Badge>}
                                            </div>

                                            <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 text-sm">
                                                <div>
                                                    <span className="text-muted-foreground">Odometer:</span>{" "}
                                                    <span className="font-medium">{entry.odometer_reading.toLocaleString()} km</span>
                                                </div>
                                                <div>
                                                    <span className="text-muted-foreground">Liters:</span>{" "}
                                                    <span className="font-medium">{Number(entry.liters).toFixed(2)} L</span>
                                                </div>
                                                <div>
                                                    <span className="text-muted-foreground">Price/L:</span>{" "}
                                                    <span className="font-medium">{formatCurrency(Number(entry.price_per_liter))}</span>
                                                </div>
                                                <div>
                                                    <span className="text-muted-foreground">Total:</span>{" "}
                                                    <span className="font-semibold text-lg">{formatCurrency(Number(entry.total_cost))}</span>
                                                </div>
                                                {entry.km_per_liter && (
                                                    <div>
                                                        <span className="text-muted-foreground">Consumption:</span>{" "}
                                                        <span className="font-medium">{Number(entry.km_per_liter).toFixed(2)} km/L</span>
                                                    </div>
                                                )}
                                                {entry.distance_traveled && (
                                                    <div>
                                                        <span className="text-muted-foreground">Distance:</span>{" "}
                                                        <span className="font-medium">{entry.distance_traveled} km</span>
                                                    </div>
                                                )}
                                            </div>

                                            {entry.notes && (
                                                <p className="text-sm text-muted-foreground italic border-l-2 border-border pl-3">
                                                    {entry.notes}
                                                </p>
                                            )}

                                            {entry.receipt_image_url && (
                                                <div className="flex items-center gap-2">
                                                    <ImageIcon className="h-4 w-4 text-muted-foreground" />
                                                    <a
                                                        href={entry.receipt_image_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-sm text-primary hover:underline flex items-center gap-1"
                                                    >
                                                        View Receipt
                                                        <ExternalLink className="h-3 w-3" />
                                                    </a>
                                                </div>
                                            )}
                                        </div>

                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" size="icon" disabled={deletingId === entry.id} className="shrink-0">
                                                    {deletingId === entry.id ? (
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    ) : (
                                                        <Trash2 className="h-4 w-4" />
                                                    )}
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Delete Fuel Entry?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This will permanently delete this fuel entry from {formatDate(entry.date)}. This action
                                                        cannot be undone.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => handleDelete(entry.id)}
                                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                    >
                                                        Delete
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
