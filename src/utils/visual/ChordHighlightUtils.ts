import type { CSSProperties } from "react";

import { ChordType } from "@/types/enums/ChordType";
import type { ChordReference } from "@/types/interfaces/ChordReference";
import { NoteGroupingId } from "@/types/NoteGroupingId";
import type { RomanChord } from "@/types/RomanChord";
import { chordActiveHighlightFor } from "@/utils/visual/NoteGroupingColorRegistry";


/** Resolve catalog id for active-chord highlighting (slash bass ignored). */
export function groupingIdForActiveChord(
  roman?: RomanChord,
  chordRef?: ChordReference | null,
): NoteGroupingId {
  return roman?.chordType ?? chordRef?.id ?? ChordType.Unknown;
}

/** Lookup + highlight fill from roman and/or chord ref. */
export function highlightForActiveChord(
  roman?: RomanChord,
  chordRef?: ChordReference | null,
): string {
  return chordActiveHighlightFor(groupingIdForActiveChord(roman, chordRef));
}

/** CSS background for an active chord highlight (progression cells, etc.). */
export function activeChordHighlightStyle(groupingId: NoteGroupingId): CSSProperties {
  return { backgroundColor: chordActiveHighlightFor(groupingId) };
}
