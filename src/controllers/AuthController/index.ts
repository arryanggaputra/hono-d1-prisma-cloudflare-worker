import { compareSync } from "bcrypt-edge";
import { z } from "zod";
import App from "~/app";
import db from "~/db";
import { exclude } from "~/db/utils";
import validationMiddleware from "~/middleware/validationMiddleware";
import Response from "~/utils/response";
import { sign } from "hono/jwt";
import { hashSync } from "bcrypt-edge";

const schema = z.object({
  email: z.string().min(1),
  password: z.string().min(1),
});

const schemaRegister = z
  .object({
    name: z.string().min(3).max(60),
    email: z.string().min(3).max(60),
    password: z
      .string()
      .min(8)
      .regex(
        new RegExp(
          /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
        ),
        {
          message:
            "Minimum 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character",
        }
      ),
    password_confirmation: z.string().min(8),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords don't match",
    path: ["password_confirmation"],
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
  .post(
    "/register",
    validationMiddleware(schemaRegister, (error, c) => {
      return new Response(c).error(error);
    }),
    async (c) => {
      const request = c.req.valid("json");
      const hashedPassword = hashSync(request.password, 8);
      try {
        await db(c.env).users.create({
          data: {
            password: hashedPassword,
            email: request.email ?? "",
            name: request.name ?? "",
          },
        });
      } catch (error: any) {
        return new Response(c).error(error);
      }
      return c.json(request);
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
