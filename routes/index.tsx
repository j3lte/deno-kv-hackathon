import { HandlerContext, PageProps } from "$fresh/server.ts";

import { SessionState, User } from "@utils/types.ts";
import { getUserBySession } from "@utils/db.ts";
import { MAX_SECRET_SIZE } from "@utils/const.ts";

import CreateSecret from "@islands/CreateSecret.tsx";
import PageHead from "@components/PageHead.tsx";
import SVG_Safe_Element from "../components/SVGSafe.tsx";

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
        <div class="mb-2">
          <div className="flex justify-center">
            <SVG_Safe_Element className="w-48 h-48" />
          </div>
          <p class="text-center text-gray-900">
            Share a secret with anyone. It will be burned after it is read...
          </p>
        </div>
        <CreateSecret maxSecretLength={MAX_SECRET_SIZE} />
      </div>
    </>
  );
}
