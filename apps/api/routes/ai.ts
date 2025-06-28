import { talk } from "@syllaby/core";
import { Hono } from "hono";

const app = new Hono();

app.get("/talk", async (c) => {
	const message = c.req.query("message");
	if (!message) {
		return c.json({ error: "Message query parameter is required" }, 400);
	} else {
		const res = await talk(message);
		return c.json(res);
	}
});

export default app;
