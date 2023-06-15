import { HandlerContext, PageProps } from "$fresh/server.ts";

import { SessionState, User } from "@utils/types.ts";
import { getUserBySession } from "@utils/db.ts";

import CreateSecret from "@islands/CreateSecret.tsx";
import PageHead from "@components/PageHead.tsx";

interface Data {
  user: User | null;
}

export async function handler(
  _req: Request,
  ctx: HandlerContext<Data, SessionState>,
) {
  if (!ctx.state.session) {
    return ctx.render({ user: null });
  }
  const user = await getUserBySession(ctx.state.session);
  return ctx.render({ user });
}

export default function Home(props: PageProps<Data>) {
  return (
    <>
      <PageHead props={props} />
      <div class="p-4 mx-auto max-w-screen-md">
        <CreateSecret />
      </div>
    </>
  );
}
