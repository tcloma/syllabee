import { embed } from "@syllaby/core";
import { Hono } from "hono";
import { chunkText, parseText } from "../utils/textUtils";

const app = new Hono();

app.post("/", async (c) => {
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
	console.log("File data received:", file.type);

	const data = await parseText(file);
	if (data === "") {
		return c.json({ error: `Unsupported file type '${file.type}'` }, 400);
	}
	const chunks = chunkText(data);
	const embeddings = await embed(chunks);
	/* TODO:
	 * Save chunks and embeddings to the database
	 * This is a placeholder for the actual database save operation.
	 */

	return c.json({ chunks, embeddings });
});

export default app;
