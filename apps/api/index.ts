import { Hono } from "hono";
import { ai, classes, users } from "./routes/_routemap";
import { createHotServer } from "./utils/hmr";

const app = new Hono();

app.get("/", (c) => {
	return c.json({ message: "Welcome to the Syllaby API!" });
});

app.route("/ai", ai);
app.route("/classes", classes);
app.route("/users", users);

export default createHotServer({
	port: 5151,
	fetch: app.fetch,
	idleTimeout: 60,
});
