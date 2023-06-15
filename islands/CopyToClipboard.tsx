import { JSX } from "preact";
import { useState } from "preact/hooks";

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
  const [copied, setCopied] = useState(false);

  return (
    <Button
      type="button"
      onClick={() => {
        setCopied(true);
        navigator.clipboard.writeText(data);
      }}
      class={`focus:outline-none ${copied ? "bg-green-500" : "bg-blue-500"} ${
        className ?? ""
      }`}
      title={copied ? "Copied!" : "Copy to clipboard"}
      aria-label={copied ? "Copied!" : "Copy to clipboard"}
    >
      {copied
        ? <IconClipboardCheck size={size} />
        : <IconClipboard size={size} />}
    </Button>
  );
}
