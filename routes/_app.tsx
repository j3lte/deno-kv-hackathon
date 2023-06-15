import { AppProps } from "$fresh/server.ts";
import { IconBrandDeno, IconBrandGithub } from "@utils/icons.ts";

export default function App({ Component }: AppProps) {
  return (
    <body class="bg-gray-100 min-h-screen flex flex-col text-xs">
      <div class="px-4 pt-4 md:pt-8 pb-3 mx-auto w-full max-w-screen-md flex-1">
        <Component />
      </div>
      <div class="bg-gray-700 py-4 text-white text-center flex italic justify-center items-center gap-3">
        <a
          href="https://github.com/j3lte/deno-kv-hackathon"
          target="_blank"
          class="inline-block text-white hover:text-gray-400 flex items-center gap-2"
          aria-label="Open Github repository for Exchange Secrets"
        >
          <span className="">
            Open Source
          </span>
          <IconBrandGithub />
        </a>
        <div className="bg-gray-100 w-1 h-1" />
        <a
          href="https://deno.com/deploy"
          target="_blank"
          class="inline-block text-white hover:text-gray-400 flex items-center gap-2"
          aria-label="Open Deno Deploy"
        >
          <span className="">
            Powered by Deno Deploy
          </span>
          <IconBrandDeno />
        </a>
      </div>
    </body>
  );
}
