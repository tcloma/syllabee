import { createId as cuid } from "@paralleldrive/cuid2";
import { sql } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

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
	subject: text().default(""),
	semester: text().default(""),
	archived: int({ mode: "boolean" }).default(false),
	...timestamps,
});
