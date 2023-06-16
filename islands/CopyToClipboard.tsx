import { JSX } from "preact";
import { useComputed, useSignal } from "@preact/signals";

import { IconClipboard, IconClipboardCheck } from "@utils/icons.ts";

import { Button } from "@components/Button.tsx";

interface Props extends JSX.HTMLAttributes<HTMLButtonElement> {
  data: string;
  text?: string;
  size?: number;
  className?: string;
}

export default function CopyToClipboardButton(
  { data, size, className }: Props,
): JSX.Element {
  const copied = useSignal(false);
  const bgClass = useComputed(() => {
    if (copied.value) return "bg-green-500";
    return "bg-gray-700";
  });
  const title = useComputed(() => {
    if (copied.value) return "Copied!";
    return "Copy to clipboard";
  });

  const blinkCopied = () => {
    copied.value = true;
    navigator.clipboard.writeText(data);
    setTimeout(() => {
      copied.value = false;
    }, 1000);
  };

  return (
    <Button
      type="button"
      onClick={blinkCopied}
      class={`focus:outline-none transition duration-150 ease-in-out ${bgClass} ${
        className ?? ""
      }`}
      title={title}
      aria-label={title}
    >
      {copied.value
        ? <IconClipboardCheck size={size} />
        : <IconClipboard size={size} />}
    </Button>
  );
}
