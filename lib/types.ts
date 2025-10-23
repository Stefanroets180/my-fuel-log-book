export interface FuelEntry {
  id: number
  date: string
  odometer_reading: number
  liters: number
  price_per_liter: number
  total_cost: number
  petrol_station: string | null
  receipt_image_url: string | null
  is_work_travel: boolean
  km_per_liter: number | null
  distance_traveled: number | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface CreateFuelEntryInput {
  date: string
  odometer_reading: number
  liters: number
  price_per_liter: number
  petrol_station?: string
  receipt_image_url?: string
  is_work_travel: boolean
  notes?: string
}
