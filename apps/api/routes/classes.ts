import { zValidator as zv } from "@hono/zod-validator";
import { db, eq } from "@syllaby/db";
import { classes } from "@syllaby/db/schema";
import { Hono } from "hono";
import { z } from "zod";

const app = new Hono();

const formData = z.object({
	user_id: z.string().uuid(),
	name: z.string(),
});

const deleteParams = z.object({
	id: z.string().uuid(),
});

app.get("/", async (c) => {
	const classes = await db.query.classes.findMany();
	console.log("Classes fetched:", classes);
	return c.json({ classes });
});

app.post("/", zv("form", formData), async (c) => {
	const body = c.req.valid("form");
	const { user_id, name } = body;

	const created_class = await db
		.insert(classes)
		.values({
			user_id,
			name,
		})
		.returning();

	return c.json({ "Class created!": created_class });
});

app.delete("/:id", zv("param", deleteParams), async (c) => {
	const id = c.req.param("id");
	console.log("Deleting class with ID:", id);

	const deleted_class = await db
		.delete(classes)
		.where(eq(classes.id, id))
		.returning();

	console.log("Class deleted:", deleted_class);
	return c.json({ "Class deleted!": deleted_class });
});

export default app;
