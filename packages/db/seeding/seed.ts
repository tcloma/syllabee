import { reset, seed } from "drizzle-seed";
import { db } from "../client";
import * as schema from "../schema";

await reset(db, schema);
console.log("🔥 Database reset successfully.");

await seed(db, schema.users);
console.log("🌱 Users seeded successfully.");
