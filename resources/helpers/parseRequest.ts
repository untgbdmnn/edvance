import { Context } from "hono";

export default async function parseRequest<T>(c: Context): Promise<T> {
  const contentType = c.req.header('Content-Type');
  let rawData: unknown;

  try {
    if (contentType?.includes('multipart/form-data')) {
      rawData = await c.req.parseBody();
    } else if (contentType?.includes('application/json')) {
      rawData = await c.req.json();
    } else {
      throw new Error('Unsupported Content-Type');
    }

    return rawData as T;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to parse request: ${error.message}`);
    } else {
      throw new Error('Failed to parse request: Unknown error');
    }
  }
}