import { defineConfig } from "drizzle-kit";

export default defineConfig({
	out: "./migrations",
	schema: "./schema.ts",
	dialect: "turso",
	dbCredentials: {
		url: process.env.DB_URL as string,
		authToken: process.env.DB_AUTH_TOKEN as string, 
	},
});
