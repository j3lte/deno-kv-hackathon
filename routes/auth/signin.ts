import { Handlers } from "$fresh/server.ts";
import { signIn } from "kv_oauth";
import { client } from "@utils/auth.ts";
import { log } from "@utils/log.ts";

export const handler: Handlers = {
  async GET(req) {
    log("auth", "signin");
    return await signIn(req, client);
  },
};
