import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const client = postgres(process.env.DB_URL as string, {
	prepare: false,
	ssl: {
		rejectUnauthorized: false, // Set up proper SSL configuration in production
	},
});

export const db = drizzle({ client, schema });
