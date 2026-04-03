"use client";

import {
  COLUMNS_PER_BAR,
  type BarRow,
} from "@/types/ChordProgressions/ChordProgressionFormattingTypes";

export function ChordProgressionDisplay({ bars }: { bars: BarRow[] }) {
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
          {bar.map((tok, tokIndex) => (
            <div
              key={`${barIndex}-${tokIndex}`}
              className="flex items-center justify-center border-x border-neutral-600/40 px-2"
              style={{ gridColumn: `span ${tok.colSpan}` }}
            >
              {tok.label}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
