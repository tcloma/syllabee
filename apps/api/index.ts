import { talk } from "@syllab/core";
import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
	return c.text("Hello, World!");
});

app.get("/talk", async (c) => {
	const message = c.req.query("message")!;
	const response = await talk(message);
	return c.json(response);
});

export default app;