"use client";

import { ProgressionNotebookCell } from "./ProgressionNotebookCell";
import {
  COLUMNS_PER_BAR,
  COMPACT_PATTERN_TOKENS_PER_LINE,
  ChordProgressionBarGrid,
} from "@/types/ChordProgressions/ChordProgressionFormattingTypes";

export function ProgressionNotebook({
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
    <div id="progression-notebook" className="flex w-full min-w-0 flex-col pr-2">
      {grid.map((row, rowIndex) => (
        <div
          key={rowIndex}
          id={`progression-notebook-row-${rowIndex}`}
          className="grid items-stretch border-b border-neutral-600/40 py-1 first:border-t"
          style={{
            gridTemplateColumns: `repeat(${columnsPerRow}, minmax(0, 1fr))`,
          }}
        >
          {row.map((tok, tokIndex) => {
            const isActive =
              readHeadStepIndex != null && tok.progressionEntryIndex === readHeadStepIndex;
            return (
              <ProgressionNotebookCell
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
