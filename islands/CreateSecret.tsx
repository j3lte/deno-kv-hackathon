import { useState } from "preact/hooks";
import { Input, Textarea } from "@components/Input.tsx";

import IconEye from "https://deno.land/x/tabler_icons_tsx@0.0.3/tsx/eye.tsx";
import IconEyeOff from "https://deno.land/x/tabler_icons_tsx@0.0.3/tsx/eye-off.tsx";

export default function CreateSecret() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form
      class="flex flex-col space-y-4"
      method="POST"
      action="/api/secret"
    >
      <div class="flex flex-col space-y-2">
        <label for="secret" class="text-sm font-semibold">
          Secret
        </label>
        <Textarea
          class="h-32"
          name="secret"
          placeholder="Type your secret here..."
          required
        />
      </div>

      <div class="flex flex-col space-y-2">
        <label for="password" class="text-sm font-semibold">
          Password
        </label>
        <div className="w-full flex flex-row">
          <Input
            type={showPassword ? "text" : "password"}
            name="password"
            class="flex-1 border-r-0 outline-none focus:outline-none"
            style="border-top-right-radius: 0px; border-bottom-right-radius: 0px;"
          />
          <button
            type="button"
            onClick={() => setShowPassword((pw) => !pw)}
            class={`px-4 py-2 text-sm font-semibold text-white border(gray-500 2) rounded border-l-0 bg-blue-500 outline-none focus:outline-none`}
            style="border-top-left-radius: 0px; border-bottom-left-radius: 0px;"
          >
            {showPassword ? <IconEyeOff /> : <IconEye />}
          </button>
        </div>
      </div>

      <div class="flex flex-col space-y-2">
        <button
          type="submit"
          class="px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded"
        >
          Create
        </button>
      </div>
    </form>
  );
}
