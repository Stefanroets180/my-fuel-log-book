import postgres from "postgres"

// Create a postgres client using Supabase connection string
// The connection string should be in format: postgresql://[user]:[password]@[host]:[port]/[database]
const connectionString =
    process.env.DATABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL?.replace("https://", "postgresql://postgres:") + "/postgres"

if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set. Please add it to your .env.local file.")
}

// Initialize postgres client with tagged template literal support
export const sql = postgres(connectionString, {
    // Automatically handle connection pooling
    max: 10,
    // Idle timeout
    idle_timeout: 20,
    // Connection timeout
    connect_timeout: 10,
})

export default sql
