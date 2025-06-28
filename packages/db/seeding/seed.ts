import { reset, seed } from "drizzle-seed";
import { db } from "../client";
import * as schema from "../schema";

const { users, files, classes, chunks } = schema;

await reset(db, schema);
console.log("🔥 Database reset successfully.");

await seed(db, { users });
console.log("🌱 Users seeded successfully.");