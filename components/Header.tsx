import { User } from "@utils/types.ts";
import { isAdmin } from "@utils/util.ts";
import { APP_NAME } from "@utils/const.ts";

import BrandGithub from "https://deno.land/x/tabler_icons_tsx@0.0.3/tsx/brand-github.tsx";
import LockSquare from "https://deno.land/x/tabler_icons_tsx@0.0.3/tsx/lock-square.tsx";

import { ButtonLink } from "./Button.tsx";
import ProfilePopOver from "@islands/ProfilePopOver.tsx";

export function Header(props: { user: User | null; hideButton?: boolean }) {
  const isAdminUser = props.user ? isAdmin(props.user.id) : false;

  return (
    <>
      <div class="flex flex-row justify-between items-center">
        <a
          href="/"
          class="hover:text-gray-700 flex justify-center items-center gap-1"
        >
          <div class="h-8 flex items-center justify-center">
            <LockSquare size={32} />
          </div>
          <h1 class="text-3xl font-bold">{APP_NAME}</h1>
        </a>

        {!props.hideButton && (
          <div class="flex items-center gap-4">
            {props.user
              ? (
                <>
                  <div
                    data-popover-target="popover-default"
                    data-popover-placement="bottom-end"
                    data-popover-trigger="click"
                    class="cursor-pointer"
                  >
                    <img
                      src={props.user.avatarUrl}
                      class="w-10 h-10 rounded-full"
                      alt=""
                    />
                  </div>
                  <ProfilePopOver
                    name={props.user.name}
                    login={props.user.login}
                    admin={isAdminUser}
                  />
                </>
              )
              : (
                <>
                  <ButtonLink
                    href="/auth/signin"
                    class="hover:bg-blue-600 text-xs flex justify-center items-center gap-1"
                  >
                    <div>Log in with GitHub</div>
                    <div class={`text-white`}>
                      <BrandGithub />
                    </div>
                  </ButtonLink>
                </>
              )}
          </div>
        )}
      </div>
    </>
  );
}
