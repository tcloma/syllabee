import { createId as cuid } from "@paralleldrive/cuid2";
import { sql } from "drizzle-orm";
import {
	boolean,
	integer,
	pgTable,
	text,
	uuid,
	vector,
} from "drizzle-orm/pg-core";

const timestamps = {
	updated_at: text().default(sql`CURRENT_TIMESTAMP`),
	created_at: text().default(sql`CURRENT_TIMESTAMP`),
};

export const users = pgTable("users", {
	id: uuid()
		.primaryKey()
		.$defaultFn(() => cuid()),
	name: text().notNull(),
	email: text().notNull().unique(),
	...timestamps,
});

export const classes = pgTable("classes", {
	id: uuid()
		.primaryKey()
		.$defaultFn(() => cuid()),
	user_id: text()
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	name: text().notNull(),
	semester: text().default(""),
	archived: boolean().default(false),
	...timestamps,
});

export const files = pgTable("files", {
	id: uuid()
		.primaryKey()
		.$defaultFn(() => cuid()),
	class_id: text()
		.notNull()
		.references(() => classes.id, { onDelete: "cascade" }),
	name: text().notNull(),
	type: text().notNull(),
	size: integer().notNull(),
	...timestamps,
});

export const chunks = pgTable("chunks", {
	id: uuid()
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
	 * pgvector is used for storing embeddings
	 * Assumes OpenAI text-embedding-3-small is used for embedding
	 */
	embedding: vector({ dimensions: 1536 }).notNull(),
	chunk_index: integer().notNull(),
	...timestamps,
});
