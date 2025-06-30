import { zValidator as zv } from "@hono/zod-validator";
import { embed } from "@syllaby/core";
import { getTopKChunks } from "@syllaby/db/getTopKChunks";
import { Hono } from "hono";
import { chunkText } from "../utils/textUtils";
import { askBody, askParam } from "../utils/zodTypes";

const app = new Hono();

app.get("/ask", (c) => {
	return c.json({
		message: "Ask route is working",
	});
});

app.post(
	"/ask/:class_id",
	zv("form", askBody),
	zv("param", askParam),
	async (c) => {
		const { message } = c.req.valid("form");
		const { class_id } = c.req.valid("param");

		console.log({ message, class_id });

		const chunks = chunkText(message);
		const res = await embed(chunks);
		const embeddings = res.data[0]?.embedding;

		if (!embeddings) {
			return c.json({ error: "Failed to generate embeddings" }, 500);
		}

		console.log(embeddings);

		const top3chunks = await getTopKChunks(embeddings, 3, class_id);

		return c.json({
			message: "Embeddings generated successfully",
			embeddings: top3chunks,
		});
	},
);

export default app;
