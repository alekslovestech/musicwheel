"use client";

import { ChordProgressionTokenCell } from "./ChordProgressionTokenCell";
import {
  COLUMNS_PER_BAR,
  COMPACT_PATTERN_TOKENS_PER_LINE,
  ChordProgressionBarGrid,
} from "@/types/ChordProgressions/ChordProgressionFormattingTypes";

export function ChordProgressionDisplay({
  grid,
  readHeadStepIndex,
  isCompact = false,
}: {
  grid: ChordProgressionBarGrid;
  readHeadStepIndex: number | null;
  isCompact?: boolean;
}) {
  if (grid.length === 0) return null;

  const columnsPerRow = isCompact ? COMPACT_PATTERN_TOKENS_PER_LINE : COLUMNS_PER_BAR;

  return (
    <div id="chord-progression-display" className="flex flex-col">
      {grid.map((row, rowIndex) => (
        <div
          key={rowIndex}
          id={`chord-progression-row-${rowIndex}`}
          className="grid items-stretch border-b border-neutral-600/40 py-1 first:border-t"
          style={{
            gridTemplateColumns: `repeat(${columnsPerRow}, minmax(0, 1fr))`,
          }}
        >
          {row.map((tok, tokIndex) => {
            const isActive =
              readHeadStepIndex != null && tok.progressionEntryIndex === readHeadStepIndex;
            return (
              <ChordProgressionTokenCell
                key={`${rowIndex}-${tokIndex}`}
                token={tok}
                isActive={isActive}
                isCompact={isCompact}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
