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
        isActive ? "bg-cp-highlight/15 ring-1 ring-inset ring-cp-highlight/40" : ""
      }`}
      style={{ gridColumn: `span ${token.colSpan}` }}
    >
      <div className="flex flex-col items-center gap-0.5 py-0.5">
        <span className="text-sm font-semibold leading-tight">{token.label}</span>
        {token.absoluteLabel != null && (
          <span className="text-xs font-normal text-muted-foreground leading-tight">
            {token.absoluteLabel}
          </span>
        )}
      </div>
    </div>
  );
}
