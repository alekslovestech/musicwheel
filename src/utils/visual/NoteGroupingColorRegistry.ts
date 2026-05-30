import { NoteGroupingId } from "@/types/NoteGroupingId";
import { NoteGroupingLibrary } from "@/types/NoteGroupingLibrary";
import { SpecialType } from "@/types/enums/SpecialType";
import { toNoteIndices } from "@/types/IndexTypes";
import { AppColor } from "@/utils/visual/AppColor";
import { ColorUtils } from "@/utils/visual/ColorUtils";
import { INTERVAL_CLASS_COLORS } from "@/utils/visual/IntervalClassColors";

export function getColorForGrouping(id?: NoteGroupingId): AppColor {
  return GROUPING_COLORS.get(id!) ?? DEFAULT_GROUPING_COLOR;
}

/** Semi-transparent fill for active chord highlights (staff, progression cells, etc.). */
export function chordActiveHighlightFor(id?: NoteGroupingId): AppColor {
  return getColorForGrouping(id).alpha(CHORD_HIGHLIGHT_ALPHA);
}

const DEFAULT_GROUPING_COLOR = INTERVAL_CLASS_COLORS[0];
const CHORD_HIGHLIGHT_ALPHA = 0.32;

/**
 * Precomputed colors keyed by catalog {@link NoteGroupingId}.
 * Spread/narrow/hidden variants differ from their standard triad counterparts because offsets differ;
 * progressions using standard ChordType ids will not pick up spread colors (by design).
 * For arbitrary live selections on the wheel, use ColorUtils.getColorForIndices instead.
 */
function buildGroupingColorMap(): Map<NoteGroupingId, AppColor> {
  const colors = new Map<NoteGroupingId, AppColor>();
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

const GROUPING_COLORS: ReadonlyMap<NoteGroupingId, AppColor> = buildGroupingColorMap();
