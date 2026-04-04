"use client";

import {
  COLUMNS_PER_BAR,
  type BarRow,
} from "@/types/ChordProgressions/ChordProgressionFormattingTypes";

export type ChordProgressionDisplayProps = {
  bars: BarRow[];
  /** When set, the token whose `progressionEntryIndex` matches is highlighted. */
  activeProgressionStepIndex?: number | null;
};

export function ChordProgressionDisplay({
  bars,
  activeProgressionStepIndex = null,
}: ChordProgressionDisplayProps) {
  if (bars.length === 0) return null;

  return (
    <div className="flex flex-col">
      {bars.map((bar, barIndex) => (
        <div
          key={barIndex}
          className="grid items-stretch border-b border-neutral-600/40 py-1 first:border-t"
          style={{
            gridTemplateColumns: `repeat(${COLUMNS_PER_BAR}, minmax(0, 1fr))`,
          }}
        >
          {bar.map((tok, tokIndex) => {
            const isActive =
              activeProgressionStepIndex !== null &&
              activeProgressionStepIndex !== undefined &&
              tok.progressionEntryIndex === activeProgressionStepIndex;
            return (
              <div
                key={`${barIndex}-${tokIndex}`}
                data-active={isActive ? "true" : undefined}
                className={`flex items-center justify-center border-x border-neutral-600/40 px-2 ${
                  isActive ? "bg-amber-500/15 ring-1 ring-inset ring-amber-500/40" : ""
                }`}
                style={{ gridColumn: `span ${tok.colSpan}` }}
              >
                {tok.label}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
