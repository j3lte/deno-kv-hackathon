import { Handlers } from "$fresh/server.ts";
import { PageProps } from "$fresh/server.ts";

import { SessionState, User } from "@utils/types.ts";
import { getSecretFromContext, getUserFromContext } from "@utils/util.ts";
import { deleteSecret } from "@utils/db.ts";

import PageHead from "@components/PageHead.tsx";
import DecryptSecret from "@islands/DecryptSecret.tsx";

interface Data {
  user: User | null;
  id: string;
  attempts: number | null;
}

export const handler: Handlers<Data, SessionState> = {
  GET: async (req, ctx) => {
    const secret = await getSecretFromContext(ctx);
    if (!secret) {
      return ctx.renderNotFound();
    }

    if (!secret.decryptAttempts || secret.decryptAttempts <= 0) {
      await deleteSecret(secret.id);
      return ctx.renderNotFound();
    }

    const user = await getUserFromContext(ctx);

    return ctx.render({
      user,
      id: secret.id,
      attempts: secret.decryptAttempts,
    });
  },
};

export default function SecretPage(props: PageProps<Data>) {
  return (
    <>
      <PageHead props={props} />
      <div class="p-4 mx-auto max-w-screen-md flex flex-col">
        <DecryptSecret
          id={props.data.id}
          attempts={props.data.attempts}
        />
      </div>
    </>
  );
}
