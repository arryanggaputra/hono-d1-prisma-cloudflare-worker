import { Context } from "hono";
import { StatusCode } from "hono/utils/http-status";
import { ZodError } from "zod";

class Response {
  context: Context<any, any, {}>;

  constructor(c: Context) {
    this.context = c;
  }

  /**
   * check if object is came from Zod
   * @param obj
   * @returns boolean
   */
  isZodError = (obj: ZodError) => {
    return obj.name === "ZodError" && Array.isArray(obj.issues);
  };

  /**
   * Mapping zod error to be more simple
   * @param error
   * @returns array of object {field, message}
   */
  mapZodError = (error: ZodError) => {
    return error.issues.map((issue) => {
      const field = issue.path.join(".");
      const message = issue.message;
      return {
        field,
        message,
      };
    });
  };

  success = (data: any) => {
    return this.context.json({
      success: true,
      data,
    });
  };

  error = (error: any, statusCode?: StatusCode) => {
    return this.context.json(
      {
        success: false,
        error: this.isZodError(error) ? this.mapZodError(error) : error,
      },
      statusCode ?? 400
    );
  };
}
export default Response;
