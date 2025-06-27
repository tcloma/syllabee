import { talk } from "@syllaby/core";
import { db } from "@syllaby/db";
import { Hono } from "hono";
import { createHotServer } from "./utils/hotServer";
import { chunkText, parseText } from "./utils/textUtils";

const app = new Hono();

app.get("/", (c) => {
	console.log(process.env.DB_URL);
	return c.json({ message: "Welcome to the Syllaby API!" });
});

app.get("/users", async (c) => {
	const users = await db.query.users.findMany();
	console.log("Users fetched:", users);
	return c.json({ users });
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

export default createHotServer({
	port: 5151,
	fetch: app.fetch,
	idleTimeout: 60,
});

console.log("🔥 API server is running at http://localhost:5151");
