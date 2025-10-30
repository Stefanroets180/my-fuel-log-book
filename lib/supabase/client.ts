import { createBrowserClient } from '@supabase/ssr'

// Singleton pattern to prevent multiple client instances
let client: ReturnType<typeof createBrowserClient> | null = null

export function createClient() {
  // Return existing client if already created
  if (client) {
    return client
  }

  // Create new client
  client = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  return client
}


/*
// Placeholder export when Supabase is not installed
export function createClient() {
  throw new Error("Supabase is not configured. Please follow SUPABASE_AUTHENTICATION_SETUP.md")
}
*/
