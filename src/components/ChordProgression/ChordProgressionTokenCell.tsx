"use client";

import type { FormattedBarToken } from "@/types/ChordProgressions/ChordProgressionFormattingTypes";

export function ChordProgressionTokenCell({
  token,
  isActive,
}: {
  token: FormattedBarToken;
  isActive: boolean;
}) {
  return (
    <div
      data-active={isActive ? "true" : undefined}
      className={`flex items-center justify-center border-x border-neutral-600/40 px-2 ${
        isActive
          ? "bg-amber-500/15 ring-1 ring-inset ring-amber-500/40"
          : ""
      }`}
      style={{ gridColumn: `span ${token.colSpan}` }}
    >
      {token.label}
    </div>
  );
}
