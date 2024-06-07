import { Hono } from "hono";
import UserController from "./controllers/UserController";

const app = new Hono();

app.route("/users", UserController);

export default app;
