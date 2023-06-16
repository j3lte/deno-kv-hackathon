import { JSX } from "preact";
import { useEffect } from "preact/hooks";
import { useComputed, useSignal } from "@preact/signals";

import { SecretWithExtra } from "@utils/types.ts";
import { IconAtOff, IconTrash } from "@utils/icons.ts";

export interface Props {
  secrets: SecretWithExtra[];
  hideOwner?: boolean;
}

export default function SecretsList(
  { secrets, hideOwner }: Props,
): JSX.Element {
  const secretsList = useSignal<SecretWithExtra[]>([]);
  const isEmpty = useComputed(() => secretsList.value.length === 0);

  useEffect(() => {
    secretsList.value = secrets;
  }, [secrets]);

  const deleteSecret = async (id: string) => {
    const res = await fetch(`/api/secret/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      const json = await res.json();
      if (json.error) {
        alert(json.error);
      } else if (json.deleted) {
        secretsList.value = secretsList.value.filter(
          (secret) => secret.id !== id,
        );
      }
    }
  };

  return (
    <div class="flex flex-col mt-4">
      {isEmpty.value && (
        <div class="flex flex-col items-center justify-center p-4">
          <p class="text-sm text-gray-500">No secrets found.</p>
        </div>
      )}
      {secretsList.value.map((secret) => (
        <div class="flex flex-row items-center justify-between py-2 border-b border-gray-300">
          <div class="flex">
            {!hideOwner && (
              <div class="flex justify-center items-center mr-4">
                {secret.user?.avatarUrl
                  ? (
                    <img
                      src={secret.user?.avatarUrl}
                      class="w-10 h-10 rounded-full"
                      style={`aspect-ratio: 1`}
                      alt={`Avatar of ${secret.user?.name}`}
                      title={`Avatar of ${secret.user?.name}`}
                    />
                  )
                  : (
                    <div class="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                      <IconAtOff size={20} />
                    </div>
                  )}
              </div>
            )}
            <div class="flex flex-col">
              <p class="text-xs">
                <b>ID:</b>{" "}
                <a
                  href={`/secret/${secret.id}`}
                  target={"_blank"}
                  class="text-green-700 hover:text-gray-600"
                >
                  {secret.id}
                </a>
              </p>
              {!hideOwner && secret.user && (
                <a
                  className="text-xs"
                  href={`https://github.com/${secret.user.login}`}
                  target="_blank"
                >
                  <b>Owner:</b> {secret.user.name} (@{secret.user.login})
                </a>
              )}
              {!hideOwner && !secret.user && (
                <p className="text-xs">
                  <b>Owner:</b> Anonymous
                </p>
              )}
              <p class="text-xs">
                <b>Created:</b> {secret.createdAt}
              </p>
              <p
                class={`text-xs ${
                  secret.burnStatus.burned ? "text-red-700" : ""
                }`}
              >
                <b>Burn within:</b> {secret.burnStatus.burnWithin}
              </p>
              <p class="text-xs">
                <b>Decrypt attempts:</b> {secret.decryptAttempts}
              </p>
            </div>
          </div>
          <div class="flex flex-row">
            <IconTrash
              className="px-2 aspect-square text-red-500 hover:text-red-600 cursor-pointer"
              size={32}
              onClick={() => deleteSecret(secret.id)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
