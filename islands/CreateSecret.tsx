import { JSX } from "preact";
import { useComputed, useSignal } from "@preact/signals";
import { IS_BROWSER } from "$fresh/runtime.ts";

import { Input } from "@components/Input.tsx";
import Textarea from "@islands/TextArea.tsx";
import ShareButton from "@islands/ShareButton.tsx";

import CopyToClipboardButton from "./CopyToClipboard.tsx";
import PasswordLine from "./PasswordLine.tsx";
import BurnSlider from "./BurnSlider.tsx";

export interface Props {
  maxSecretLength: number;
}

export default function CreateSecret({ maxSecretLength }: Props): JSX.Element {
  const createdSecretID = useSignal<string | null>(null);
  const error = useSignal<string | null>(null);

  const secretUrl = useComputed(() => {
    if (!IS_BROWSER || !createdSecretID || !window.location) return null;
    return `${window.location.origin}/secret/${createdSecretID}`;
  });

  const reset = () => {
    createdSecretID.value = null;
    error.value = null;
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    if (!formData.get("secret")) return;

    fetch("/api/secret", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          createdSecretID.value = null;
          error.value = data.error;
        } else {
          createdSecretID.value = data.id;
          error.value = null;
          form.reset();
        }
      });
  };

  if (createdSecretID.value !== null) {
    return (
      <div class="flex flex-col">
        <div class="flex flex-col pt-2">
          <label for="secretCreated" class="text-sm font-semibold">
            Secret Created!
          </label>
          <div class="flex flex-row mt-8">
            <Input
              type="text"
              name="secretCreated"
              id="secretCreated"
              value={secretUrl.value || ""}
              readOnly
              class="flex-grow border-r-0 outline-none focus:outline-none font-bold"
              style="border-top-right-radius: 0px; border-bottom-right-radius: 0px;"
            />
            <CopyToClipboardButton
              data={secretUrl.value || ""}
              class={`px-4 py-2 text-sm font-semibold text-white border(gray-500 2) rounded border-l-0 outline-none focus:outline-none`}
              style="border-top-left-radius: 0px; border-bottom-left-radius: 0px;"
            />
          </div>

          <p class="text-center mt-1">
            Copy the url and share it...
          </p>

          <div class="flex flex-row items-center justify-center space-x-2 mb-8 mt-2">
            <ShareButton url={secretUrl.value || ""} type="whatsapp" />
            <ShareButton url={secretUrl.value || ""} type="telegram" />
            <ShareButton url={secretUrl.value || ""} type="email" />
          </div>
        </div>
        <div class="flex flex-col space-y-2">
          <button
            type="button"
            onClick={reset}
            class="px-4 py-2 text-sm font-semibold text-white bg-gray-700 rounded"
          >
            Create another
          </button>
        </div>
      </div>
    );
  }

  if (error.value !== null) {
    return (
      <div class="flex flex-col space-y-4">
        <div class="flex flex-col space-y-2">
          <label for="secret" class="text-sm font-semibold">
            Error
          </label>
          <div class="px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      class="flex flex-col space-y-4"
      onSubmit={handleSubmit}
    >
      <div class="flex flex-col space-y-2">
        <label for="secret" class="text-sm font-semibold">
          Secret
        </label>
        <Textarea
          class="h-32"
          name="secret"
          id="secret"
          placeholder="Type your secret here..."
          maxLength={maxSecretLength}
          required
          autoFocus
        />
      </div>

      <PasswordLine />

      <BurnSlider />

      <div class="flex flex-col">
        <button
          type="submit"
          class="px-4 py-2 text-sm font-semibold text-white bg-gray-700 rounded mt-4"
        >
          Create
        </button>
      </div>
    </form>
  );
}
