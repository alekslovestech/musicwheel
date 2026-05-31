"use client";

import type { FormattedBarToken } from "@/types/ChordProgressions/ChordProgressionFormattingTypes";
import { chordActiveHighlightFor } from "@/utils/visual/NoteGroupingColorRegistry";

export function ChordProgressionTokenCell({
  token,
  isActive,
  isCompact = false,
}: {
  token: FormattedBarToken;
  isActive: boolean;
  isCompact?: boolean;
}) {
  const tokenIndex = token.progressionEntryIndex.toString();
  return (
    <div
      id={`token-labels-box-${tokenIndex}`}
      data-active={isActive ? "true" : undefined}
      className={`flex items-center justify-center border-x border-neutral-600/40 px-2 ${
        isActive ? "ring-1 ring-inset ring-cp-highlight/40" : ""
      }`}
      style={{
        gridColumn: isCompact ? undefined : `span ${token.colSpan}`,
        ...(isActive && {
          backgroundColor: chordActiveHighlightFor(token.groupingId).css(),
        }),
      }}
    >
      <div id={`token-labels-${tokenIndex}`} className="flex flex-col items-center gap-0.5 py-0.5">
        <span
          id={`token-label-roman-${tokenIndex}`}
          className="text-sm font-semibold leading-tight"
        >
          {token.label}
        </span>
        {token.absoluteLabel != null && (
          <span
            id={`token-label-absolute-${tokenIndex}`}
            className="text-xs font-normal text-muted-foreground leading-tight"
          >
            {token.absoluteLabel}
          </span>
        )}
      </div>
    </div>
  );
}
