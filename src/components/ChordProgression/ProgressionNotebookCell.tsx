"use client";

import type { FormattedBarToken } from "@/types/ChordProgressions/ChordProgressionFormattingTypes";
import { chordActiveHighlightFor } from "@/utils/visual/NoteGroupingColorRegistry";

export function ProgressionNotebookCell({
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
      id={`progression-notebook-cell-${tokenIndex}`}
      data-active={isActive ? "true" : undefined}
      className={`flex flex-col items-center justify-center gap-0.5 border-x border-containers-dividerStrong px-2 py-0.5 ${
        isActive ? "ring-1 ring-inset ring-cp-highlight/40" : ""
      }`}
      style={{
        gridColumn: isCompact ? undefined : `span ${token.colSpan}`,
        ...(isActive && {
          backgroundColor: chordActiveHighlightFor(token.groupingId).css(),
        }),
      }}
    >
      <span className="text-sm font-semibold leading-tight">{token.label}</span>
      {token.absoluteLabel != null && (
        <span className="text-xs font-normal text-muted-foreground leading-tight">
          {token.absoluteLabel}
        </span>
      )}
    </div>
  );
}
