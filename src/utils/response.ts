import { Context } from "hono";
import { StatusCode } from "hono/utils/http-status";

class Response {
  context: Context<any, any, {}>;

  constructor(c: Context) {
    this.context = c;
  }

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
        error,
      },
      statusCode ?? 400
    );
  };
}
export default Response;
