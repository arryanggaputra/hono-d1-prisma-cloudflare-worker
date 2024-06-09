import { compareSync } from "bcrypt-edge";
import { z } from "zod";
import App from "~/app";
import db from "~/db";
import { exclude } from "~/db/utils";
import validationMiddleware from "~/middleware/validationMiddleware";
import Response from "~/utils/response";
import { decode, sign } from "hono/jwt";

const schema = z.object({
  email: z.string().min(1),
  password: z.string().min(1),
});

const AuthController = App
  /**
   * Login
   */
  .post(
    "/login",
    validationMiddleware(schema, (error, c) => {
      return new Response(c).error(error);
    }),
    async (c) => {
      const data = c.req.valid("json");
      const user = await db(c.env).users.findFirst({
        where: {
          email: data.email,
        },
      });

      if (!user) {
        return new Response(c).error(
          "User not found. Please check your credentials or sign up for a new account.",
          401
        );
      }

      const isPasswordCorrect = compareSync(data.password, user?.password);

      if (!isPasswordCorrect) {
        return new Response(c).error(
          "Invalid email or password. Please check your credentials and try again.",
          401
        );
      }

      const filteredUser = exclude(user, ["password"]);

      /**
       * create payload for JWT
       */
      const payload = {
        data: filteredUser,
        exp: Math.floor(Date.now() / 1000) + 60 * 60, // Token expires in 5 minutes
      };

      /**
       * sign payload
       */
      const token = await sign(payload, c.env.JWT_SECRET);

      return new Response(c).success({
        token,
        data: filteredUser,
      });
    }
  )
  .get("/me", (c) => {
    /**
     * get user payload
     */
    const { data } = c.get("jwtPayload");
    return new Response(c).success(data);
  });

export default AuthController;
