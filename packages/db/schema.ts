import {
	boolean,
	integer,
	pgTable,
	text,
	timestamp,
	uuid,
	vector,
} from "drizzle-orm/pg-core";

const timestamps = {
	updated_at: timestamp().defaultNow(),
	created_at: timestamp().defaultNow(),
};

export const users = pgTable("users", {
	id: uuid().primaryKey().defaultRandom(),
	name: text().notNull(),
	email: text().notNull().unique(),
	...timestamps,
});

export const classes = pgTable("classes", {
	id: uuid().primaryKey().defaultRandom(),
	user_id: uuid()
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	name: text().notNull(),
	semester: text().$defaultFn(() => new Date().getFullYear().toString()),
	archived: boolean().default(false),
	...timestamps,
});

export const files = pgTable("files", {
	id: uuid().primaryKey().defaultRandom(),
	class_id: uuid()
		.notNull()
		.references(() => classes.id, { onDelete: "cascade" }),
	name: text().notNull(),
	type: text().notNull(),
	size: integer().notNull(),
	...timestamps,
});

export const chunks = pgTable("chunks", {
	id: uuid().primaryKey().defaultRandom(),
	file_id: uuid()
		.notNull()
		.references(() => files.id, { onDelete: "cascade" }),
	class_id: uuid()
		.notNull()
		.references(() => classes.id, { onDelete: "cascade" }),
	text: text().notNull(),
	/*
	 * pg_vector is used for storing embeddings
	 * Assumes OpenAI text-embedding-3-small is used for embedding
	 */
	embedding: vector({ dimensions: 1536 }).notNull(),
	chunk_index: integer().notNull(),
	...timestamps,
});
