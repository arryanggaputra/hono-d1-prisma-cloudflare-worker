import { Context } from "hono";
import db from "../db";
import Response from "../utils/response";

class Users {
  index = async (c: Context) => {
    const users = await db(c.env).users.findMany();
    return new Response(c).success(users);
  };

  store = async (c: Context) => {
    const request = await c.req.formData();
    try {
      await db(c.env).users.create({
        data: {
          email: request.get("email") ?? "",
          password: request.get("password") ?? "",
          name: request.get("name") ?? "",
        },
      });
    } catch (error: any) {
      return new Response(c).error(error);
    }
    return c.json(request);
  };
}

export default Users;
