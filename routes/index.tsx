import { HandlerContext, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";

import { SessionState, User } from "@utils/types.ts";
import { getUserBySession } from "@utils/db.ts";

import { APP_NAME } from "@utils/const.ts";
import { Header } from "@components/Header.tsx";
import CreateSecret from "@islands/CreateSecret.tsx";

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
  if (!user) {
    return ctx.render({ user: null });
  }

  return ctx.render({ user });
}

export default function Home(props: PageProps<Data>) {
  return (
    <>
      <Head>
        <title>{APP_NAME}</title>
      </Head>
      <Header user={props.data?.user ?? null} />
      <div class="p-4 mx-auto max-w-screen-md">
        <CreateSecret />
      </div>
    </>
  );
}
