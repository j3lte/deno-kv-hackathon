import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { SessionState } from "@utils/types.ts";
import { getSessionId } from "kv_oauth";

export async function handler(
  req: Request,
  ctx: MiddlewareHandlerContext<SessionState>,
) {
  ctx.state.session = await getSessionId(req);
  return await ctx.next();
}
