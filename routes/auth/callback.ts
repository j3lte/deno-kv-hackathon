import { Handlers } from "$fresh/server.ts";
import { setUserWithSession } from "@utils/db.ts";
import { getAuthenticatedUser } from "@utils/github.ts";
import { User } from "@utils/types.ts";
import { handleCallback } from "kv_oauth";
import { client } from "@utils/auth.ts";

export const handler: Handlers = {
  async GET(req) {
    const { response, accessToken, sessionId } = await handleCallback(
      req,
      client,
    );
    const ghUser = await getAuthenticatedUser(accessToken);

    const user: User = {
      id: String(ghUser.id),
      login: ghUser.login,
      name: ghUser.name,
      avatarUrl: ghUser.avatar_url,
    };
    await setUserWithSession(user, sessionId);

    return response;
  },
};
