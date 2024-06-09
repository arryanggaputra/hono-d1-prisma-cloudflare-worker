import App from "./app";
import UserController from "~/controllers/UserController";
import AuthController from "~/controllers/AuthController";
import { jwt } from "hono/jwt";

const app = App;

const guestPage = ["/auth/login"];

app.use("*", (c, next) => {
  const path = c.req.path;
  if (guestPage.includes(path)) {
    return next();
  }
  const jwtMiddleware = jwt({
    secret: c.env.JWT_SECRET,
  });
  return jwtMiddleware(c, next);
});

app.route("/auth", AuthController);
app.route("/users", UserController);

export default app;
