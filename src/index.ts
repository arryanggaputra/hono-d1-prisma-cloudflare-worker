import { Hono } from "hono";
import Users from "./routes/users";

const app = new Hono();

app.get("/users", new Users().index);
app.post("/users", new Users().store);

export default app;
