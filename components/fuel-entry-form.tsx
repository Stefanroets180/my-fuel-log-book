"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, X, ImageIcon } from "lucide-react"

interface FuelEntryFormProps {
  onSuccess?: () => void
}

export function FuelEntryForm({ onSuccess }: FuelEntryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null)
  const [receiptFile, setReceiptFile] = useState<File | null>(null)

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    odometer_reading: "",
    liters: "",
    price_per_liter: "",
    petrol_station: "",
    is_work_travel: false,
    notes: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB")
      return
    }

    setReceiptFile(file)

    // Upload immediately
    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload-receipt", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Upload failed")

      const data = await response.json()
      setReceiptUrl(data.url)
    } catch (error) {
      console.error("Upload error:", error)
      alert("Failed to upload receipt. Please try again.")
      setReceiptFile(null)
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveReceipt = () => {
    setReceiptUrl(null)
    setReceiptFile(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const totalCost = Number.parseFloat(formData.liters) * Number.parseFloat(formData.price_per_liter)

      const response = await fetch("/api/fuel-entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: new Date(formData.date).toISOString(),
          odometer_reading: Number.parseInt(formData.odometer_reading),
          liters: Number.parseFloat(formData.liters),
          price_per_liter: Number.parseFloat(formData.price_per_liter),
          petrol_station: formData.petrol_station || null,
          receipt_image_url: receiptUrl,
          is_work_travel: formData.is_work_travel,
          notes: formData.notes || null,
        }),
      })

      if (!response.ok) throw new Error("Failed to create entry")

      // Reset form
      setFormData({
        date: new Date().toISOString().split("T")[0],
        odometer_reading: "",
        liters: "",
        price_per_liter: "",
        petrol_station: "",
        is_work_travel: false,
        notes: "",
      })
      setReceiptUrl(null)
      setReceiptFile(null)

      onSuccess?.()
    } catch (error) {
      console.error("Submit error:", error)
      alert("Failed to save fuel entry. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const totalCost =
    formData.liters && formData.price_per_liter
      ? (Number.parseFloat(formData.liters) * Number.parseFloat(formData.price_per_liter)).toFixed(2)
      : "0.00"

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Fuel Entry</CardTitle>
        <CardDescription>Record your fuel purchase and track consumption</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" name="date" type="date" value={formData.date} onChange={handleInputChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="odometer_reading">Odometer Reading (km)</Label>
              <Input
                id="odometer_reading"
                name="odometer_reading"
                type="number"
                placeholder="125000"
                value={formData.odometer_reading}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="liters">Liters</Label>
              <Input
                id="liters"
                name="liters"
                type="number"
                step="0.01"
                placeholder="45.50"
                value={formData.liters}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price_per_liter">Price per Liter (ZAR)</Label>
              <Input
                id="price_per_liter"
                name="price_per_liter"
                type="number"
                step="0.01"
                placeholder="22.50"
                value={formData.price_per_liter}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="petrol_station">Petrol Station</Label>
              <Input
                id="petrol_station"
                name="petrol_station"
                type="text"
                placeholder="Shell, Engen, BP, etc."
                value={formData.petrol_station}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label>Total Cost (ZAR)</Label>
              <div className="flex h-10 items-center rounded-md border border-input bg-muted px-3 text-lg font-semibold">
                R {totalCost}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="receipt">Receipt Image (Optional)</Label>
            <div className="flex flex-col gap-4">
              {!receiptUrl ? (
                <div className="flex items-center gap-4">
                  <Input
                    id="receipt"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={isUploading}
                    className="flex-1"
                  />
                  {isUploading && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />}
                </div>
              ) : (
                <div className="relative inline-block">
                  <div className="flex items-center gap-4 rounded-lg border border-border bg-muted p-4">
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Receipt uploaded</p>
                      <p className="text-xs text-muted-foreground">{receiptFile?.name}</p>
                    </div>
                    <Button type="button" variant="ghost" size="icon" onClick={handleRemoveReceipt} className="h-8 w-8">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_work_travel"
              checked={formData.is_work_travel}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_work_travel: checked as boolean }))}
            />
            <Label htmlFor="is_work_travel" className="cursor-pointer font-normal">
              Work Travel (for SARS tax purposes)
            </Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="Add any additional notes..."
              value={formData.notes}
              onChange={handleInputChange}
              rows={3}
            />
          </div>

          <Button type="submit" disabled={isSubmitting || isUploading} className="w-full">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Add Fuel Entry"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
