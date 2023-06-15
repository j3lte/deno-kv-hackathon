import { JSX } from "preact";

import { PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";

import { User } from "@utils/types.ts";
import { APP_NAME } from "@utils/const.ts";
import { Header } from "./Header.tsx";

export interface Props {
  props?: PageProps<{
    user: User | null;
  }>;
  hideButton?: boolean;
}

export default function PageHead({ props, hideButton }: Props): JSX.Element {
  return (
    <>
      <Head>
        <title>{APP_NAME}</title>
      </Head>
      <Header user={props?.data?.user ?? null} hideButton={hideButton} />
    </>
  );
}
