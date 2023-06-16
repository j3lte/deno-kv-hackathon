import { JSX } from "preact";
import { computed, useSignal } from "@preact/signals";

import { IconEye, IconEyeOff } from "@utils/icons.ts";

import { Input } from "@components/Input.tsx";

export interface Props {
  autoFocus?: boolean;
}

export default function PasswordLine({ autoFocus }: Props): JSX.Element {
  const showPassword = useSignal(false);
  const inputType = computed(() => showPassword.value ? "text" : "password");
  const buttonLabel = computed(() =>
    showPassword.value ? "Hide password" : "Show password"
  );

  return (
    <div class="flex flex-col space-y-2">
      <label for="secretPW" class="text-sm font-semibold">
        Password
      </label>
      <div className="w-full flex flex-row">
        <Input
          type={inputType}
          name="secretPW"
          id="secretPW"
          autoComplete="off"
          autoFocus={autoFocus}
          required
          class="flex-1 border-r-0 outline-none focus:outline-none"
          style="border-top-right-radius: 0px; border-bottom-right-radius: 0px;"
        />
        <button
          type="button"
          onClick={() => showPassword.value = !showPassword.value}
          class={`px-4 py-2 text-sm font-semibold text-white border(gray-500 2) rounded border-l-0 bg-gray-700 outline-none focus:outline-none`}
          style="border-top-left-radius: 0px; border-bottom-left-radius: 0px;"
          aria-label={buttonLabel}
        >
          {showPassword.value ? <IconEyeOff /> : <IconEye />}
        </button>
      </div>
    </div>
  );
}
