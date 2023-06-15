import { JSX } from "preact";
import { useState } from "preact/hooks";

import PasswordLine from "./PasswordLine.tsx";
import { Textarea } from "@components/Input.tsx";
import CopyToClipboardButton from "./CopyToClipboard.tsx";

interface Props {
  attempts: number | null;
  id: string;
}

export default function DecryptSecret(
  { id, attempts }: Props,
): JSX.Element {
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState<string | null>(null);

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    if (!formData.get("secretPW")) return;

    fetch(`/api/decrypt/${id}`, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.updateAttempts) {
          window.location.reload();
        } else if (data.content) {
          setContent(data.content);
          setError(null);
        } else if (data.error) {
          setContent(null);
          setError(data.error);
        }
      });
  };

  return (
    <form
      class="flex flex-col space-y-4"
      onSubmit={handleSubmit}
    >
      {!content && <PasswordLine autoFocus />}

      {error && (
        <div class="flex flex-col space-y-2">
          <div class="text-red-500">{error}</div>
        </div>
      )}

      {content && (
        <div class="flex flex-col space-y-2">
          <div class="flex flex-col space-y-2">
            <div class="flex flex-row justify-between items-center">
              <label for="secret" class="text-sm font-semibold">
                Secret
              </label>
              <CopyToClipboardButton
                className="px-2 aspect-square"
                size={16}
                data={content}
              />
            </div>
            <Textarea
              class="h-32"
              name="secret"
              value={content}
              readOnly
            />
          </div>
          <span class="text-xs text-center">
            Note: after viewing this secret, it is deleted!
          </span>
        </div>
      )}

      {!content && (
        <div class="flex flex-col space-y-2">
          <button
            type="submit"
            class="px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded"
          >
            Decrypt ({attempts} attempts left)
          </button>
        </div>
      )}
    </form>
  );
}
