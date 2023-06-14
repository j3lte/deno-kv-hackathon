import { Handlers } from "$fresh/server.ts";
import { deleteSession } from "@utils/db.ts";
import { getSessionId, signOut } from "kv_oauth";

export const handler: Handlers = {
  async GET(req) {
    const session = await getSessionId(req);
    if (session) {
      await deleteSession(session);
    }

    return await signOut(req);
  },
};
