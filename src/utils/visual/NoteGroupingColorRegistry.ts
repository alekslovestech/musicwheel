import chroma from "chroma-js";
import { NoteGroupingId } from "@/types/NoteGroupingId";
import { NoteGroupingLibrary } from "@/types/NoteGroupingLibrary";
import { SpecialType } from "@/types/enums/SpecialType";
import { toNoteIndices } from "@/types/IndexTypes";
import { ColorUtils } from "@/utils/visual/ColorUtils";
import { DEFAULT_INTERVAL_CLASS_COLOR } from "@/utils/visual/IntervalClassColors";

const CHORD_HIGHLIGHT_ALPHA = 0.32;
const GROUPING_COLORS: ReadonlyMap<NoteGroupingId, chroma.Color> = buildGroupingColorMap();

export function getColorForGrouping(id?: NoteGroupingId): chroma.Color {
  return GROUPING_COLORS.get(id!) ?? DEFAULT_INTERVAL_CLASS_COLOR;  
}

/** Semi-transparent fill for active chord highlights (staff, progression cells, etc.). */
export function chordActiveHighlightFor(id?: NoteGroupingId): chroma.Color {  
  return getColorForGrouping(id).alpha(CHORD_HIGHLIGHT_ALPHA);
}

/**
 * Precomputed colors keyed by catalog {@link NoteGroupingId}.
 * Spread/narrow/hidden variants differ from their standard triad counterparts because offsets differ;
 * progressions using standard ChordType ids will not pick up spread colors (by design).
 * For arbitrary live selections on the wheel, use ColorUtils.getColorForIndices instead.
 */
function buildGroupingColorMap(): Map<NoteGroupingId, chroma.Color> {
  const colors = new Map<NoteGroupingId, chroma.Color>();  for (const id of NoteGroupingLibrary.getAllIds()) {
    if (id === SpecialType.None || id === SpecialType.Note) continue;
    const { offsets } = NoteGroupingLibrary.getGroupingById(id);
    colors.set(
      id,
      ColorUtils.getColorForIndices(toNoteIndices(offsets.map((offset) => offset as number))),
    );
  }
  return colors;
}

