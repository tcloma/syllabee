import { db } from "@syllaby/db";
import { Hono } from "hono";

const app = new Hono();

app.get("/", async (c) => {
	const users = await db.query.users.findMany();
	console.log("Users fetched:", users);
	return c.json({ users });
});

export default app;
