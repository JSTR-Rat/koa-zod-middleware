import { ZodError, ZodObject } from 'zod';

/**
 * @typedef {import("@koa/router").Middleware} Middleware
 */

/**
 * Create Middleware to Parse a Route's Request and Response data.
 * @param {object} schemas
 * @param {ZodObject} [schemas.query] - Query Params Schema
 * @param {ZodObject} [schemas.body] - Request Body Schema
 * @param {ZodObject} [schemas.response] - Response Body Schema
 * @returns {Middleware}
 */
export const parse = (schemas) => async (ctx, next) => {
  try {
    if (schemas.query !== undefined)
      ctx.request.query = schemas.query.parse(ctx.request.query);
    if (schemas.body !== undefined)
      ctx.request.body = schemas.body.parse(ctx.request.body);
  } catch (err) {
    if (err instanceof ZodError) {
      console.log('QUERY:', ctx.request.query);
      console.log('BODY:', ctx.request.body);
      console.log(err);
      ctx.status = 400;
      ctx.body = {
        errors: err.issues.map((issue) => ({
          message: issue.message,
          path: issue.path.join('.'),
        })),
      };
      return;
    }
    throw err;
  }

  await next();

  try {
    if (schemas.response !== undefined)
      ctx.body = schemas.response.parse(ctx.body);
  } catch (err) {
    console.error('Bad Response', ctx.body);
    throw err;
  }
}
