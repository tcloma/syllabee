import { zValidator as zv } from "@hono/zod-validator";
import { db, eq } from "@syllaby/db";
import { classes } from "@syllaby/db/schema";
import { Hono } from "hono";
import { processUpload } from "../utils/processUpload";
import { isValidFileType } from "../utils/textUtils";
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
			if (!isValidFileType(file.type)) {
				return c.json({ error: `Unsupported file type '${file.type}'` }, 400);
			}

			const uploaded_file = await processUpload(file, class_id);

			return c.json({
				message: "File parsed and chunks uploaded successfully",
				file: uploaded_file,
			});
		} else {
			const uploaded_files = [];

			for (const f of file) {
				if (!isValidFileType(f.type)) {
					return c.json({ error: `Unsupported file type '${f.type}'` }, 400);
				}

				const uploaded_file = await processUpload(f, class_id);
				uploaded_files.push(uploaded_file);
			}

			return c.json({
				message: "Files parsed and chunks uploaded successfully",
				files: uploaded_files,
			});
		}
	},
);

export default app;
