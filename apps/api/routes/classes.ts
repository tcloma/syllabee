import { zValidator as zv } from "@hono/zod-validator";
import { embed } from "@syllaby/core";
import { db, eq } from "@syllaby/db";
import { chunks, classes, files } from "@syllaby/db/schema";
import { Hono } from "hono";
import { z } from "zod";
import { chunkText, isValidFileType, parseText } from "../utils/textUtils";

const app = new Hono();

const uploadBody = z.object({
	file: z.union([z.instanceof(File), z.array(z.instanceof(File))]),
});

const formData = z.object({
	user_id: z.string().uuid(),
	name: z.string(),
});

const classIdParam = z.object({
	class_id: z.string().uuid(),
});

app.get("/", async (c) => {
	const classes = await db.query.classes.findMany();
	console.log("Classes fetched:", classes);
	return c.json({ classes });
});

app.post("/", zv("form", formData), async (c) => {
	const body = c.req.valid("form");
	const { user_id, name } = body;

	const created_class = await db
		.insert(classes)
		.values({
			user_id,
			name,
		})
		.returning();

	return c.json({ "Class created!": created_class });
});

app.delete("/:id", zv("param", classIdParam), async (c) => {
	const id = c.req.param("id");
	console.log("Deleting class with ID:", id);

	const deleted_class = await db
		.delete(classes)
		.where(eq(classes.id, id))
		.returning();

	console.log("Class deleted:", deleted_class);
	return c.json({ "Class deleted!": deleted_class });
});

app.post(
	"/:class_id/upload",
	zv("param", classIdParam),
	zv("form", uploadBody),
	async (c) => {
		const { class_id } = c.req.valid("param");
		const { file } = c.req.valid("form");

		if (!Array.isArray(file)) {
			if (!isValidFileType(file.type)) {
				return c.json({ error: `Unsupported file type '${file.type}'` }, 400);
			}
			const { name, type, size } = file;
			const uploaded_file = await db
				.insert(files)
				.values({
					class_id,
					name,
					type,
					size,
				})
				.returning();
			const { text, text_chunks, embeddings } = await parseChunkEmbed(file);
			const file_id = uploaded_file[0]?.id as string;

			for (let i = 0; i < text_chunks.length; i++) {
				const embedding = embeddings[i]?.embedding as number[];

				const uploaded_chunk = await db
					.insert(chunks)
					.values({
						file_id,
						class_id,
						text,
						embedding,
						chunk_index: i,
					})
					.returning();
				console.log("Chunk uploaded:", uploaded_chunk);
			}

			return c.json({
				message: "File parsed and chunks uploaded successfully",
				file: uploaded_file,
			});
		}

		async function parseChunkEmbed(file: File) {
			const text = await parseText(file);
			const text_chunks = chunkText(text);
			const embeddings = await embed(text_chunks);

			return { text, text_chunks, embeddings: embeddings.data };
		}
	},
);

export default app;
