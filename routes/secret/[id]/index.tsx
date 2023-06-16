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
  burnWithin: string;
}

export const handler: Handlers<Data, SessionState> = {
  GET: async (req, ctx) => {
    const secret = await getSecretFromContext(ctx);
    if (!secret) {
      return ctx.renderNotFound();
    }

    if (
      !secret.decryptAttempts || secret.decryptAttempts <= 0 ||
      secret.burnStatus.burned
    ) {
      await deleteSecret(secret.id);
      return ctx.renderNotFound();
    }

    const user = await getUserFromContext(ctx);

    return ctx.render({
      user,
      id: secret.id,
      attempts: secret.decryptAttempts,
      burnWithin: secret.burnStatus.burnWithin,
    });
  },
};

export default function SecretPage(props: PageProps<Data>) {
  return (
    <>
      <PageHead props={props} />
      <div class="p-4 mx-auto max-w-screen-md flex flex-col">
        <div class="mb-2 space-y-2">
          <h2 class="text-xl font-semibold text-center">Open the secret</h2>
          <p class="text-center text-gray-900">
            This is password protected. Enter the password to decrypt it.
          </p>
          <p class="text-center text-gray-900">
            This secret will be burned after it is read or{" "}
            <b>{props.data.burnWithin}</b> of not opening.
          </p>
        </div>
        <DecryptSecret
          id={props.data.id}
          attempts={props.data.attempts}
        />
      </div>
    </>
  );
}
