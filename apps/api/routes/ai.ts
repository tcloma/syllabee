import { zValidator as zv } from "@hono/zod-validator";
import { ask, embed } from "@syllabee/core";
import { getTopKChunks } from "@syllabee/db/getTopKChunks";
import { Hono } from "hono";
import { chunkText } from "../utils/textUtils";
import { ErrorCode, tryCatch, tryCatchSync } from "../utils/tryCatch";
import { askBody, askParam } from "../utils/zodTypes";

const app = new Hono();

/*
 * POST /ask/:class_id
 * This route takes a user query, processes it through a RAG pipeline,
 * and returns a context aware LLM response.
 */

app.post(
	"/ask/:class_id",
	zv("form", askBody),
	zv("param", askParam),
	async (c) => {
		// Data is Validated by ZOD so it is guaranteed to be present
		const { message } = c.req.valid("form");
		const { class_id } = c.req.valid("param");

		console.log({ message, class_id });

		// RAG Pipeline
		// 1: Chunking input data to match gpt-4.1-mini token limit
		const chunkResult = tryCatchSync(() => chunkText(message));
		if (chunkResult.error) {
			console.error("Chunking failed:", chunkResult.error);
			return c.json(
				{
					error: "Failed to process message",
					code: ErrorCode.CHUNKING_FAILED,
				},
				400,
			);
		}

		// 2. Sending chunks to OpenAI text-embedding-3-small
		const embeddingResult = await tryCatch(embed(chunkResult.data));
		if (embeddingResult.error) {
			console.error("Embedding failed:", embeddingResult.error);
			return c.json(
				{
					error: "Failed to generate embeddings",
					code: ErrorCode.EMBEDDING_FAILED,
				},
				500,
			);
		}

		const embedding = embeddingResult.data.data?.[0]?.embedding;
		if (!embedding) {
			console.error("No embedding returned");
			return c.json(
				{
					error: "No embedding returned",
					code: ErrorCode.NO_EMBEDDING_RETURNED,
				},
				500,
			);
		}

		// 3. Vector DB search based on cosine similarity
		const topChunkResult = await tryCatch(
			getTopKChunks(embedding, 3, class_id),
		);
		if (topChunkResult.error) {
			console.error("Vector search failed:", topChunkResult.error);
			return c.json(
				{
					error: "Failed to retrieve relevant context",
					code: ErrorCode.VECTOR_SEARCH_FAILED,
				},
				500,
			);
		}

		const context = topChunkResult.data.map((c) => c.text).join("\n---\n");

		// 4. Prompting LLM with injected context and user query
		const askResult = await tryCatch(ask(context, message));
		if (askResult.error) {
			console.error("LLM prompt failed:", askResult.error);
			return c.json(
				{
					error: "Failed to generate AI response",
					code: ErrorCode.LLM_PROMPT_FAILED,
				},
				500,
			);
		}

		// 5. Streaming response back to the client
		let question_response = "";
		try {
			for await (const event of askResult.data) {
				// Created and Completed events are logged, but not currently used in response
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
						console.warn("Unknown event type:", event.type);
						break;
				}
			}
		} catch (err) {
			console.error("Stream error:", err);
			return c.json(
				{
					error: "Failed to stream AI response",
					code: ErrorCode.STREAMING_FAILED,
				},
				500,
			);
		}

		/*
		 * TODO: Stream response back to client when calling Hono endpoint,
		 * currently we are storing the response in a variable and returning as regular JSON.
		 */

		console.log("Final response:", question_response);
		return c.json({ question_response });
	},
);

export default app;
