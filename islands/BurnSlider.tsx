import { JSX } from "preact";
import { computed, useSignal } from "@preact/signals";
import { getBurnValueLabel } from "@utils/date.ts";

export default function BurnSlider(): JSX.Element {
  const burnValue = useSignal(5);
  const burnValueLabel = computed(() => getBurnValueLabel(burnValue.value));

  return (
    <div class="flex flex-col space-y-2">
      <label for="burnAfter" class="text-sm font-semibold">
        Burn After: {burnValueLabel}
      </label>
      <div className="w-full flex flex-row">
        <input
          type="range"
          name="burnAfter"
          id="burnAfter"
          min="0"
          max="7"
          step="1"
          value={burnValue}
          onInput={(e) =>
            burnValue.value = parseInt((e.target as HTMLInputElement).value)}
          class="flex-1 border-r-0 outline-none focus:outline-none"
          style="border-top-right-radius: 0px; border-bottom-right-radius: 0px;"
        />
      </div>
    </div>
  );
}
