import { talk } from "@syllaby/core";
import { Hono } from "hono";
import { chunkText, parseText } from "./textUtils";

const app = new Hono();

app.get("/", (c) => {
	return c.text("Hello, World!");
});

app.get("/talk", async (c) => {
	const message = c.req.query("message");
	if (!message) {
		return c.json({ error: "Message query parameter is required" }, 400);
	} else {
		const res = await talk(message);
		return c.json(res);
	}
});

app.post("/upload", async (c) => {
	let formData: { [x: string]: string | File };
	/*
	 * TODO: Multi File Upload
	 * Currently, only single file upload is supported.
	 */
	try {
		formData = await c.req.parseBody();
	} catch {
		return c.json(
			{
				error: "Invalid Request",
			},
			400,
		);
	}

	const file = formData.file as File;
	console.log("File data received:", file);

	const data = await parseText(file);
	if (data === "") {
		return c.json({ error: `Unsupported file type '${file.type}'` }, 400);
	}
	const chunks = chunkText(data);

	return c.json({ text: chunks });

	/*
	 * TODO: Function Flow
	 * Indetify File Type -> Parse -> Chunk -> Return
	 * If the file type is unsupported, return an error.
	 */
});

export default Bun.serve({
	port: 5151,
	fetch: app.fetch,
	idleTimeout: 60,
});
