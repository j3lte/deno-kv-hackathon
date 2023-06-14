import { User } from "@utils/types.ts";
import { UserNameHorizontal } from "./User.tsx";
import { isAdmin } from "@utils/util.ts";
import { APP_NAME } from "@utils/const.ts";
import BrandGithub from "https://deno.land/x/tabler_icons_tsx@0.0.3/tsx/brand-github.tsx";
import LockSquare from "https://deno.land/x/tabler_icons_tsx@0.0.3/tsx/lock-square.tsx";
import { ButtonLink } from "./Button.tsx";

const linkClass = "text-sm text-blue-500 hover:underline";

export function Header(props: { user: User | null; hideNew?: boolean }) {
  return (
    <>
      <div class="flex flex-col sm:flex-row justify-between items-center">
        <a
          href="/"
          class="hover:text-gray-700 flex justify-center items-center gap-1"
        >
          <div class="h-8 flex items-center justify-center">
            <LockSquare size={32} />
          </div>
          <h1 class="text-3xl font-bold">{APP_NAME}</h1>
        </a>

        <div class="flex items-center gap-4">
          {props.user
            ? (
              <>
                <a href={`/user/${props.user.id}`}>
                  <img
                    src={props.user.avatarUrl}
                    class="w-10 h-10 rounded-full"
                    alt=""
                  />
                </a>
                <p class="text-sm text-gray-600">
                  <UserNameHorizontal user={props.user} />
                  {isAdmin(props.user?.id || "") && (
                    <span class="text-red-500">(Admin)</span>
                  )}
                </p>

                <a class={linkClass} href="/auth/signout">
                  Log out
                </a>
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
      </div>
    </>
  );
}
