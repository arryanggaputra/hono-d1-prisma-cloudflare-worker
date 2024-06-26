import db from "~/db";
import Response from "~/utils/response";
import { z } from "zod";
import { hashSync } from "bcrypt-edge";
import validationMiddleware from "~/middleware/validationMiddleware";
import App from "~/app";

/**
 * Minimum 8 characters, at least one uppercase letter, one lowercase letter
 * one number and one special character
 */
const passwordValidation = new RegExp(
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
);

/**
 * Create User schema
 */
const schema = z
  .object({
    name: z.string().min(3).max(60),
    email: z.string().min(3).max(60),
    password: z.string().min(8).regex(passwordValidation, {
      message:
        "Minimum 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character",
    }),
    password_confirmation: z.string().min(8),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords don't match",
    path: ["password_confirmation"],
  });

const UserController = App.basePath("/users")
  /**
   * get user lists
   */
  .get("/", async (c) => {
    const users = await db(c.env).users.findMany({
      select: {
        id: true,
        email: true,
        name: true,
      },
    });
    return new Response(c).success(users);
  })

  /**
   * create user
   */
  .post(
    "/",
    validationMiddleware(schema, (error, c) => {
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
  );

export default UserController;
