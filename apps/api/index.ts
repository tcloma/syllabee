import { talk } from "@syllaby/core";
import { Hono } from "hono";
import mammoth from "mammoth";
import PDF from "pdf-parse";

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
	const formData = await c.req.parseBody();
	if (!formData) {
		return c.json({ error: "File upload is required" }, 400);
	}

	if (!formData.file || !(formData.file instanceof File)) {
		return c.json({ error: "Invalid file upload" }, 400);
	}

	const file = formData.file as File;
	console.log("File data received:", file);

	const buffer = Buffer.from(await file.arrayBuffer());

	switch (true) {
		case file.type.includes("pdf"): {
			const data = await PDF(buffer);
			return c.json({
				text: data.text,
			});
		}
		case file.type.includes("word"): {
			const data = await mammoth.extractRawText({ buffer });
			return c.json({
				text: data.value,
			});
		}
		case file.type.includes("text/plain"):
			return c.json({
				text: await file.text(),
			});
		case file.type.includes("text/markdown"):
			return c.json({
				text: await file.text(),
			});
		default:
			return c.json(
				{
					error: `Unsupported file type "${file.type}"`,
					supportedTypes: ["pdf", "docx", "txt", "md"],
				},
				400,
			);
	}
});

export default Bun.serve({
	port: 5151,
	fetch: app.fetch,
	idleTimeout: 60,
});
