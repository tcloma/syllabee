import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

console.log("Process Environment:", process.env.DATABASE_URL);
const client = postgres(process.env.DATABASE_URL as string, {
	prepare: false,
	ssl: {
		rejectUnauthorized: false, // For local development, set to true in production
	},
});
export const db = drizzle({ client, schema });
