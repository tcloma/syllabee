import { db } from "@syllaby/db";
import { Hono } from "hono";

const app = new Hono();

app.get("/", async (c) => {
	const classes = await db.query.classes.findMany();
	console.log("Classes fetched:", classes);
	return c.json({ classes });
});

export default app;
