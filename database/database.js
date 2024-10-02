import postgres from "https://deno.land/x/postgresjs@v3.4.4/mod.js";

// Setting up PostgreSQL connection using environment variables.
const sql = postgres({
    user: Deno.env.get("PGUSER") || "username", // Fallback to "username" if not found in env
    password: Deno.env.get("PGPASSWORD") || "password", // Fallback to "password" if not found
    host: Deno.env.get("PGHOST") || "localhost", // Fallback to "localhost" if not found
    port: parseInt(Deno.env.get("PGPORT") || "5432"), // Default to 5432 if not found
    database: Deno.env.get("PGDATABASE") || "database", // Fallback to "database" if not found
});

export { sql };
