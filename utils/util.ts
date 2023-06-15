import { HandlerContext } from "$fresh/server.ts";
import { getSecret, getUserBySession } from "./db.ts";
import { Secret, SessionState, User } from "./types.ts";

export function redirect(location = "/") {
  const headers = new Headers();
  headers.set("location", location);
  return new Response(null, {
    status: 303,
    headers,
  });
}

export function isAdmin(userId: string) {
  const adminIds = Deno.env.get("ADMIN_USER_ID")?.split(",") ?? [];
  return adminIds.includes(userId);
}

export function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
  });
}

export const getUserFromContext = async <T>(
  ctx: HandlerContext<T, SessionState>,
): Promise<User | null> => {
  if (!ctx.state.session) {
    return null;
  }
  return await getUserBySession(ctx.state.session);
};

export const getSecretFromContext = async <T>(
  ctx: HandlerContext<T, SessionState>,
): Promise<Secret | null> => {
  if (!ctx.params.id) {
    return null;
  }
  return await getSecret(ctx.params.id);
};
