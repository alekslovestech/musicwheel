"use client";

import { ChordProgressionTokenCell } from "./ChordProgressionTokenCell";
import {
  COLUMNS_PER_BAR,
  ChordProgressionGridLane,
} from "@/types/ChordProgressions/ChordProgressionFormattingTypes";

export function ChordProgressionDisplay({
  lane,
}: {
  lane: ChordProgressionGridLane;
}) {
  const { rows, readHeadStepIndex } = lane;
  if (rows.length === 0) return null;

  return (
    <div className="flex flex-col">
      {rows.map((bar, barIndex) => (
        <div
          key={barIndex}
          className="grid items-stretch border-b border-neutral-600/40 py-1 first:border-t"
          style={{
            gridTemplateColumns: `repeat(${COLUMNS_PER_BAR}, minmax(0, 1fr))`,
          }}
        >
          {bar.map((tok, tokIndex) => {
            const isActive =
              readHeadStepIndex != null &&
              tok.progressionEntryIndex === readHeadStepIndex;
            return (
              <ChordProgressionTokenCell
                key={`${barIndex}-${tokIndex}`}
                token={tok}
                isActive={isActive}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
