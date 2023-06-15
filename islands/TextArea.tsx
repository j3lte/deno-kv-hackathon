import { JSX } from "preact";
import { useMemo, useState } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";

const inputClasses =
  "w-full px-3 py-2 bg-white rounded border(gray-500 2) disabled:(opacity-50 cursor-not-allowed)";

export default function Textarea(
  props: JSX.HTMLAttributes<HTMLTextAreaElement>,
) {
  const maxLength = props.maxLength ? Number(props.maxLength) : null;
  const [size, setSize] = useState(0);

  const onChangeArea = (e: Event) => {
    const target = e.target as HTMLTextAreaElement;
    const val = target.value;

    if (IS_BROWSER && maxLength !== null && val.length > maxLength) {
      target.value = val.slice(0, maxLength);
    }

    setSize(val.length);
  };

  const areaSizeStr = useMemo(() => {
    if (!IS_BROWSER || maxLength === null) return "";
    return `${size}/${maxLength}`;
  }, [size, maxLength]);

  return (
    <div class="flex w-full relative">
      <textarea
        {...props}
        onChange={onChangeArea}
        onKeyUp={onChangeArea}
        disabled={!IS_BROWSER || props.disabled}
        class={`${inputClasses} ${props.class ?? ""}`}
      />
      <div class="absolute -bottom-5 right-0 text-xs text-gray-500">
        {areaSizeStr}
      </div>
    </div>
  );
}
