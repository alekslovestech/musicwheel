import chroma from "chroma-js";
import { ixIntervalClass } from "@/types/IntervalClass";
import { NoteGroupingId } from "@/types/NoteGroupingId";
import { NoteGroupingLibrary } from "@/types/NoteGroupingLibrary";
import { SpecialType } from "@/types/enums/SpecialType";
import { toNoteIndices } from "@/types/IndexTypes";
import { ColorUtils } from "@/utils/visual/ColorUtils";
import { getIntervalClassColorCss } from "@/utils/visual/IntervalClassColors";

/** Neutral fallback when a grouping id has no cached color (e.g. ChordType.Unknown). */
export const DEFAULT_GROUPING_COLOR = getIntervalClassColorCss(ixIntervalClass(0));

const CHORD_HIGHLIGHT_ALPHA = 0.32;

/**
 * Precomputed colors keyed by catalog {@link NoteGroupingId}.
 * Spread/narrow/hidden variants differ from their standard triad counterparts because offsets differ;
 * progressions using standard ChordType ids will not pick up spread colors (by design).
 * For arbitrary live selections on the wheel, use ColorUtils.getColorForIndices instead.
 */
function buildGroupingColorMap(): Map<NoteGroupingId, string> {
  const colors = new Map<NoteGroupingId, string>();
  for (const id of NoteGroupingLibrary.getAllIds()) {
    if (id === SpecialType.None || id === SpecialType.Note) continue;
    const { offsets } = NoteGroupingLibrary.getGroupingById(id);
    colors.set(
      id,
      ColorUtils.getColorForIndices(toNoteIndices(offsets.map((offset) => offset as number))),
    );
  }
  return colors;
}

export const GROUPING_COLORS: ReadonlyMap<NoteGroupingId, string> = buildGroupingColorMap();

export function getColorForGrouping(id: NoteGroupingId): string {
  return GROUPING_COLORS.get(id) ?? DEFAULT_GROUPING_COLOR;
}

/** Semi-transparent fill for active chord highlights (staff, progression cells, etc.). */
export function chordHighlightFill(color: string): string {
  return chroma(color).alpha(CHORD_HIGHLIGHT_ALPHA).css();
}

/** Lookup + highlight fill for an active chord by catalog id. */
export function chordActiveHighlightFor(id: NoteGroupingId): string {
  return chordHighlightFill(getColorForGrouping(id));
}
