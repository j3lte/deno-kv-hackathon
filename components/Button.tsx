import { JSX } from "preact";
import { IS_BROWSER } from "$fresh/runtime.ts";

const buttonClasses =
  "px-4 py-2 text-sm font-semibold text-white bg-gray-700 rounded";

export function Button(props: JSX.HTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      disabled={!IS_BROWSER || props.disabled}
      class={`${buttonClasses} ${props.class || ""}`}
    />
  );
}

export function ButtonLink(props: JSX.HTMLAttributes<HTMLAnchorElement>) {
  return <a {...props} class={`${buttonClasses} ${props.class || ""}`} />;
}
