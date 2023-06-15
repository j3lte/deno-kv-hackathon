import { HandlerContext, PageProps } from "$fresh/server.ts";

import { SecretWithUser, SessionState, User } from "@utils/types.ts";
import { getUserBySession, listSecrets } from "@utils/db.ts";

import { isAdmin, redirect } from "../utils/util.ts";
import PageHead from "@components/PageHead.tsx";

interface Data {
  user: User | null;
  secrets: SecretWithUser[];
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
            <div class="flex flex-col mt-4">
              {props.data.secrets.map((secret) => (
                <div class="flex flex-row items-center justify-between p-2 border-b border-gray-300">
                  <div class="flex flex-col">
                    <p class="text-xs">
                      <b>ID:</b> {secret.id}
                    </p>
                    <p className="text-xs">
                      <b>Owner:</b> {secret.user
                        ? `${secret.user.name} (@${secret.user.login})`
                        : "Anonymous"}
                    </p>
                    <p class="text-xs">
                      <b>Created:</b> {secret.createdAt}
                    </p>
                    <p class="text-xs">
                      <b>Attempts:</b> {secret.decryptAttempts}
                    </p>
                  </div>
                  <div class="flex flex-row">
                    <a
                      href={`/secret/${secret.id}`}
                      class="text-blue-500 hover:text-blue-600"
                    >
                      View
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
