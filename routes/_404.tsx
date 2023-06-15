import { UnknownPageProps } from "$fresh/server.ts";

import { ButtonLink } from "@components/Button.tsx";
import PageHead from "@components/PageHead.tsx";

export default function NotFoundPage({ url }: UnknownPageProps) {
  const isSecret = url.pathname.startsWith("/secret/");
  const secretID = isSecret ? url.pathname.split("/")[2] : null;

  return (
    <>
      <PageHead hideButton />
      <div class="p-4 mx-auto max-w-screen-md">
        <div class="flex flex-col items-center pt-8">
          <h1 class="text-4xl font-bold mb-4">{isSecret ? "Oops" : "404"}</h1>
          <p class="text-xl">{isSecret ? "Secret" : "Page"} not found</p>
          {isSecret
            ? (
              <div class="text-xs text-center mt-4">
                <p class="">
                  It seems the secret with ID{" "}
                  <code class="font-bold">{secretID}</code> does not exist.
                </p>
                <p class="">
                  It might be expired (already viewed), deleted by the
                  user/admin or you might have the wrong URL.
                </p>
              </div>
            )
            : <p class="text-sm">Requested URL: {url.pathname}</p>}
          <ButtonLink href="/" class="mt-4" aria-label={"Go back home"}>
            Go Home
          </ButtonLink>
        </div>
      </div>
    </>
  );
}
