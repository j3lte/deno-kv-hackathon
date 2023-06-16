import { Handlers } from "$fresh/server.ts";
import { getSessionId, signOut } from "kv_oauth";

import { deleteSession } from "@utils/db.ts";
import { log } from "@utils/log.ts";

export const handler: Handlers = {
  async GET(req) {
    log("auth", "signout");
    const session = await getSessionId(req);
    if (session) {
      await deleteSession(session);
    }

    return await signOut(req);
  },
};
