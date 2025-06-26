import { createId as cuid } from "@paralleldrive/cuid2";
import { sql } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { float32Array } from "./vectorType";

const timestamps = {
	updated_at: text().default(sql`CURRENT_TIMESTAMP`),
	created_at: text().default(sql`CURRENT_TIMESTAMP`),
};

export const users = sqliteTable("users", {
	id: text()
		.primaryKey()
		.$defaultFn(() => cuid()),
	name: text().notNull(),
	email: text().notNull().unique(),
	...timestamps,
});

export const classes = sqliteTable("classes", {
	id: text()
		.primaryKey()
		.$defaultFn(() => cuid()),
	user_id: text()
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	name: text().notNull(),
	semester: text().default(""),
	archived: int({ mode: "boolean" }).default(false),
	...timestamps,
});

export const files = sqliteTable("files", {
	id: text()
		.primaryKey()
		.$defaultFn(() => cuid()),
	class_id: text()
		.notNull()
		.references(() => classes.id, { onDelete: "cascade" }),
	name: text().notNull(),
	type: text().notNull(),
	size: int().notNull(),
	...timestamps,
});

export const chunks = sqliteTable("chunks", {
	id: text()
		.primaryKey()
		.$defaultFn(() => cuid()),
	file_id: text()
		.notNull()
		.references(() => files.id, { onDelete: "cascade" }),
	class_id: text()
		.notNull()
		.references(() => classes.id, { onDelete: "cascade" }),
	text: text().notNull(),
	/*
	 * Turso Native Vectors
	 * Assumes OpenAI text-embedding-3-small is used for embedding
	 */
	embedding: float32Array({
		dimensions: 1536,
	}).notNull(),
	chunk_index: int().notNull(),
	...timestamps,
});
