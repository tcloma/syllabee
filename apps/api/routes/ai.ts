import { zValidator as zv } from "@hono/zod-validator";
import { ask, embed } from "@syllabee/core";
import { getTopKChunks } from "@syllabee/db/getTopKChunks";
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

		let question_response = "";
		const stream = await ask(context, message);

		for await (const event of stream) {
			switch (event.type) {
				case "response.created":
					console.log("Stream response created");
					break;
				case "response.completed":
					console.log("Stream response completed");
					break;
				case "response.output_text.delta":
					console.log(event.sequence_number, event.delta);
					question_response += event.delta;
					break;
				default:
					console.log("Unknown event type:", event.type);
					console.log(event);
			}
		}

		console.log(question_response);

		return c.json({
			question_response,
		});
	},
);

export default app;
