import { JSX } from "preact";
import { IS_BROWSER } from "$fresh/runtime.ts";

const inputClasses =
  "px-3 py-2 bg-white rounded border(gray-500 2) disabled:(opacity-50 cursor-not-allowed)";

export function Input(props: JSX.HTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      disabled={!IS_BROWSER || props.disabled}
      class={`${inputClasses} ${props.class ?? ""}`}
    />
  );
}
