import { Handlers } from "$fresh/server.ts";
import { getUserBySession } from "@utils/db.ts";
import { SessionState, User } from "@utils/types.ts";

interface Data {
  user: User | null;
}

export const handler: Handlers<Data, SessionState> = {
  async POST(req, ctx) {
    const form = await req.formData();
    const user = await getUserBySession(ctx.state.session ?? "");

    console.log("user", user);
    console.log("form", form);

    return new Response("OK");
  },
};
