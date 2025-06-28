import { zValidator } from "@hono/zod-validator";
import { db } from "@syllaby/db";
import { classes } from "@syllaby/db/schema";
import { z } from "zod";

import { Hono } from "hono";

const app = new Hono();

const classSchema = z.object({
	user_id: z.string().uuid(),
	name: z.string(),
});

app.get("/", async (c) => {
	const classes = await db.query.classes.findMany();
	console.log("Classes fetched:", classes);
	return c.json({ classes });
});

app.post("/", zValidator("form", classSchema), async (c) => {
	const body = await c.req.valid("form");
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

export default app;
