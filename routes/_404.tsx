import { UnknownPageProps } from "$fresh/server.ts";

import PageHead from "../components/PageHead.tsx";

export default function NotFoundPage({ url }: UnknownPageProps) {
  return (
    <>
      <PageHead hideButton />
      <div class="p-4 mx-auto max-w-screen-md">
        <div class="flex flex-col items-center pt-8">
          <h1 class="text-4xl font-bold mb-4">404</h1>
          <p class="text-xl">Page not found</p>
          <p class="text-sm">Requested URL: {url.pathname}</p>
        </div>
      </div>
    </>
  );
}
