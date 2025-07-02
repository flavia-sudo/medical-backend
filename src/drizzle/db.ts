import "dotenv/config"
import { drizzle } from "drizzle-orm/neon-http"
// import { Client } from "pg";
import * as schema from "./schema"
import { neon } from "@neondatabase/serverless"
// connection to the database
export const client = neon(process.env.Database_URL as string)


const db = drizzle(client, { schema, logger: true });

export default db;