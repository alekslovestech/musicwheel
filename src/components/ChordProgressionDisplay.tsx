"use client";
import React from "react";

import type { FormattedBarToken } from "@/utils/formatters/ChordProgressionFormatter";

export type ChordProgressionDisplayProps = {
  bars: FormattedBarToken[][];
  columnsPerBar?: number;
  className?: string;
};

export const ChordProgressionDisplay: React.FC<ChordProgressionDisplayProps> = ({
  bars,
  columnsPerBar = 16,
  className,
}) => {
  if (bars.length === 0) return null;

  return (
    <div className={["flex flex-col gap-1 font-mono", className].join(" ")}>
      {bars.map((bar, barIndex) => (
        <div
          key={barIndex}
          className="grid items-stretch"
          style={{
            gridTemplateColumns: `repeat(${columnsPerBar}, minmax(0, 1fr))`,
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
