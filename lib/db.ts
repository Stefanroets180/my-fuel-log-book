import { createClient } from "@supabase/supabase-js"

// Use Supabase for database queries
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Helper function to execute SQL queries
export async function sql(query: string, params?: any[]) {
  const { data, error } = await supabase.rpc("execute_sql", {
    query,
    params: params || [],
  })

  if (error) throw error
  return data
}

export { supabase }
