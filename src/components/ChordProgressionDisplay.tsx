"use client";
import React from "react";

import type { FormattedBarToken } from "@/utils/formatters/ChordProgressionFormatter";

export const COLUMNS_PER_BAR = 16;
export type ChordProgressionDisplayProps = {
  bars: FormattedBarToken[][];
  className?: string;
};

export const ChordProgressionDisplay: React.FC<
  ChordProgressionDisplayProps
> = ({ bars, className }) => {
  if (bars.length === 0) return null;

  return (
    <div className={["flex flex-col gap-1 font-mono", className].join(" ")}>
      {bars.map((bar, barIndex) => (
        <div
          key={barIndex}
          className="grid items-stretch"
          style={{
            gridTemplateColumns: `repeat(${COLUMNS_PER_BAR}, minmax(0, 1fr))`,
          }}
        >
          {bar.map((tok, tokIndex) => (
            <div
              key={`${barIndex}-${tokIndex}`}
              className="flex items-center justify-center border-x border-neutral-600/40 px-1"
              style={{ gridColumn: `span ${tok.colSpan}` }}
            >
              {tok.label}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
