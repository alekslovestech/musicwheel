"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { Select } from "@/components/Common/Select";
import { useGlobalMode, useIsDemoRoute } from "@/lib/hooks";
import { GlobalMode } from "@/types/enums/GlobalMode";
import { getPath } from "@/utils/slug/paths";

export function GlobalModeSelector() {
  const router = useRouter();
  const globalMode = useGlobalMode();
  const isDemoRoute = useIsDemoRoute();
  const selectedLabel = selectedModeLabel(globalMode);
  const measureRef = useRef<HTMLSpanElement>(null);
  const [selectWidth, setSelectWidth] = useState<number>();

  useLayoutEffect(() => {
    const el = measureRef.current;
    if (!el) return;
    setSelectWidth(el.offsetWidth + SELECT_WIDTH_EXTRA_PX);
  }, [selectedLabel]);

  if (isDemoRoute) return null;

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const mode = event.target.value as GlobalMode;
    if (mode === globalMode) return;
    router.push(getPath(mode, undefined, isDemoRoute));
  }

  return (
    <div className="absolute top-2 left-2 z-10 flex flex-col items-start gap-tight">
      <label htmlFor="global-mode-select" className="text-xs font-medium text-labels-textDefault">
        Mode
      </label>
      <div className="relative inline-block">
        <span
          ref={measureRef}
          aria-hidden
          className="pointer-events-none invisible absolute whitespace-nowrap text-xs font-medium"
        >
          {selectedLabel}
        </span>
        <Select
          id="global-mode-select"
          value={globalMode}
          onChange={handleChange}
          title="View mode"
          aria-label="View mode"
          style={selectWidth === undefined ? undefined : { width: selectWidth }}
          className="!min-w-0 !max-w-none !border-buttons-bgSelected/40 !bg-buttons-bgSelected/20 !py-1 !px-1 !text-xs font-medium !text-buttons-bgSelected"
        >
          {GLOBAL_MODE_OPTIONS.map(({ mode, label }) => (
            <option key={mode} value={mode}>
              {label}
            </option>
          ))}
        </Select>
      </div>
    </div>
  );
}

const GLOBAL_MODE_OPTIONS: ReadonlyArray<{ mode: GlobalMode; label: string }> = [
  { mode: GlobalMode.Harmony, label: "Harmony" },
  { mode: GlobalMode.Scales, label: "Scales" },
  { mode: GlobalMode.ChordProgressions, label: "Progressions" },
];

/** Horizontal padding (px-1 × 2) plus room for the native select chevron. */
const SELECT_WIDTH_EXTRA_PX = 26;

function selectedModeLabel(mode: GlobalMode): string {
  return GLOBAL_MODE_OPTIONS.find((option) => option.mode === mode)?.label ?? "";
}
