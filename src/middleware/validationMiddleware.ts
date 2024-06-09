import { zValidator } from "@hono/zod-validator";
import { Context } from "hono";
import { ZodSchema } from "zod";

/**
 * Define a function that creates validation middleware
 */
function validationMiddleware<T>(
  schema: ZodSchema<T>,
  errorResponse: (error: any, c: Context) => void
) {
  return zValidator("json", schema, (result, c) => {
    if (!result.success) {
      return errorResponse(result.error, c);
    }
  });
}

export default validationMiddleware;
