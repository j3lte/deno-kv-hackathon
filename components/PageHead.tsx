import { JSX } from "preact";

import { PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";

import { User } from "@utils/types.ts";
import { APP_NAME, LIVE_URL } from "@utils/const.ts";
import { Header } from "./Header.tsx";

export interface Props {
  props?: PageProps<{
    user: User | null;
  }>;
  hideButton?: boolean;
}

export default function PageHead({ props, hideButton }: Props): JSX.Element {
  const description = "A simple, secure, and private way to share secrets.";
  const image = LIVE_URL ? `${LIVE_URL}/screenshot.png` : null;
  const image_og = LIVE_URL ? `${LIVE_URL}/screenshot_og.png` : null;
  const url = LIVE_URL ? `${LIVE_URL}/` : null;

  return (
    <>
      <Head>
        <title>{APP_NAME}</title>
        <link rel="dns-prefetch" href="https://unpkg.com/" />
        <link rel="preconnect" href="https://unpkg.com/" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="crossorigin"
        />

        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        {
          // @ts-ignore - Typescript doesn't recognize color as a valid attribute for link
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#000000" />
        }
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@j3lte" />
        <meta
          name="twitter:title"
          content={description}
        />
        <meta
          name="twitter:description"
          content={description}
        />
        <meta
          name="description"
          content={description}
        />
        <meta name="twitter:creator" content="@j3lte" />
        {image && <meta name="twitter:image" content={image} />}
        <meta
          property="og:title"
          content={APP_NAME}
        />
        <meta
          property="og:description"
          content={description}
        />
        {image_og && <meta property="og:image" content={image_og} />}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={APP_NAME} />
        <meta property="og:locale" content="en_US" />
        {url && (
          <meta
            property="og:url"
            content="https://exchange-secrets.deno.dev/"
          />
        )}
      </Head>
      <Header user={props?.data?.user ?? null} hideButton={hideButton} />
    </>
  );
}
