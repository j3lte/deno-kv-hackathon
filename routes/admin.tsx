import { HandlerContext, PageProps } from "$fresh/server.ts";

import { SecretWithExtra, SessionState, User } from "@utils/types.ts";
import { getUserBySession, listSecrets } from "@utils/db.ts";
import { isAdmin, redirect } from "@utils/util.ts";

import PageHead from "@components/PageHead.tsx";
import SecretsList from "@islands/SecretsList.tsx";

interface Data {
  user: User | null;
  secrets: SecretWithExtra[];
}

export async function handler(
  _req: Request,
  ctx: HandlerContext<Data, SessionState>,
) {
  if (!ctx.state.session) {
    return redirect("/");
  }
  const user = await getUserBySession(ctx.state.session);

  if (!user || !user.id || !isAdmin(user.id)) {
    return redirect("/");
  }

  const secrets = await listSecrets();

  return ctx.render({ user, secrets });
}

export default function Home(props: PageProps<Data>) {
  return (
    <>
      <PageHead props={props} />
      <div class="p-4 mx-auto max-w-screen-md">
        <div class="flex flex-col">
          <h1 class="text-2xl font-bold">Admin</h1>
          <div class="flex flex-col mt-4">
            <h2 class="text-xl font-bold">Secrets</h2>
            <SecretsList secrets={props.data.secrets} />
          </div>
        </div>
      </div>
    </>
  );
}
