import { JSX } from "preact";
import { IS_BROWSER } from "$fresh/runtime.ts";

import { User } from "@utils/types.ts";
import {
  IconAbacus,
  IconAlignBoxCenterMiddle,
  IconLogout,
} from "@utils/icons.ts";

import { UserNameHorizontal } from "@components/User.tsx";

export interface Props {
  name: string;
  login: string;
  avatarUrl: string;
  admin: boolean;
}

export default function ProfilePopOver(
  { name, login, admin, avatarUrl }: Props,
): JSX.Element {
  const isHoverableDevice = IS_BROWSER && window.matchMedia(
    "(hover: hover) and (pointer: fine)",
  ).matches;

  return (
    <>
      <div
        data-popover-target="popover-default"
        data-popover-placement="bottom-end"
        data-popover-trigger={isHoverableDevice ? "hover" : "click"}
        class="cursor-pointer"
      >
        <img
          src={avatarUrl}
          class="w-10 h-10 rounded-full"
          alt=""
        />
      </div>
      <div
        data-popover
        id="popover-default"
        role="tooltip"
        class="absolute z-10 invisible inline-block w-64 text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800"
      >
        <div class="px-3 py-2 bg-gray-100 border-b border-gray-200 rounded-t-lg dark:border-gray-600 dark:bg-gray-700">
          <h3 class="font-semibold text-gray-900 dark:text-white">
            <UserNameHorizontal user={{ name, login } as User} />
          </h3>
        </div>
        <div class="px-3 py-2">
          <div class="flex flex-col gap-4 my-2">
            <a
              href="/user"
              class="flex flex-row items-center gap-2 hover:text-black"
            >
              <IconAlignBoxCenterMiddle />
              <span class="text-gray-500">
                Profile
              </span>
            </a>
            {admin && (
              <a
                href="/admin"
                class="flex flex-row items-center gap-2 hover:text-black"
              >
                <IconAbacus />
                <span class="text-gray-500">Admin</span>
              </a>
            )}
            <a
              href="/auth/signout"
              class="flex flex-row items-center gap-2 hover:text-black"
            >
              <IconLogout />
              <span class="text-gray-500">Sign out</span>
            </a>
          </div>
        </div>
        <div data-popper-arrow></div>
      </div>
    </>
  );
}
