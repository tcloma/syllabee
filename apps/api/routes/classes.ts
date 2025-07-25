import { zValidator as zv } from "@hono/zod-validator";
import { db, eq } from "@syllabee/db";
import { classes } from "@syllabee/db/schema";
import { Hono } from "hono";
import { processUpload } from "../utils/processUpload";
import { classIdParam, formData, uploadBody } from "../utils/zodTypes";

const app = new Hono();

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

app.delete("/:class_id", zv("param", classIdParam), async (c) => {
	const { class_id } = c.req.valid("param");

	const deleted_class = await db
		.delete(classes)
		.where(eq(classes.id, class_id));

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
			const uploaded_file = await processUpload(file, class_id);
			if (uploaded_file.isErr()) {
				console.error("Error processing file:", uploaded_file.error);
				return c.json({ error: "Failed to process file" }, 500);
			}

			return c.json({
				message: "File parsed and chunks uploaded successfully",
				file: uploaded_file.value,
			});
		} else {
			const uploaded_files = [];

			for (const f of file) {
				const uploaded_file = await processUpload(f, class_id);
				if (uploaded_file.isErr()) {
					console.error("Error processing file:", uploaded_file.error);
					return c.json({ error: "Failed to process file" }, 500);
				}

				uploaded_files.push(uploaded_file.value);
			}

			return c.json({
				message: "Files parsed and chunks uploaded successfully",
				files: uploaded_files,
			});
		}
	},
);

export default app;
