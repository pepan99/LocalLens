// Load environment variables if needed
import "dotenv/config";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

// Get database URL and auth token from environment variables
const dbUrl = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

// Validate that the required environment variables are set
if (!dbUrl) {
  throw new Error("TURSO_DATABASE_URL environment variable is not set");
}

// Create the database client
const client = createClient({
  url: dbUrl,
  authToken: authToken || undefined, // Make authToken optional
});

// Create the drizzle ORM instance
export const db = drizzle(client);
