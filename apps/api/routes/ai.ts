import { zValidator as zv } from "@hono/zod-validator";
import { ask, embed } from "@syllaby/core";
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

		const top3chunks = await getTopKChunks(embeddings, 3, class_id);
		const context = top3chunks.map((c) => c.text).join("\n---\n");

		const question_response = await ask(context, message);

		console.log(question_response);

		return c.json({
			question_response,
		});
	},
);

export default app;
