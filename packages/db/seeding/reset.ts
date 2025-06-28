import { reset } from "drizzle-seed";
import { db } from "../client";
import * as schema from "../schema";

export async function db_reset() {
	await reset(db, schema);
	console.log("🔥 Database reset successfully.");
}
process.exit();
