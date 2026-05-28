import { NoteGroupingId } from "@/types/NoteGroupingId";
import { NoteGroupingLibrary } from "@/types/NoteGroupingLibrary";
import { SpecialType } from "@/types/enums/SpecialType";
import { toNoteIndices } from "@/types/IndexTypes";
import { ColorUtils } from "@/utils/visual/ColorUtils";

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

const GROUPING_COLORS: ReadonlyMap<NoteGroupingId, string> = buildGroupingColorMap();

export function getColorForGrouping(id: NoteGroupingId): string {
  const color = GROUPING_COLORS.get(id);
  if (color === undefined) {
    throw new Error(`No cached color for NoteGroupingId: ${id}`);
  }
  return color;
}

export function getAllGroupingColors(): ReadonlyMap<NoteGroupingId, string> {
  return GROUPING_COLORS;
}

/** Colors for preset-visible groupings (pop-in legend). */
export function getVisiblePresetColors(): ReadonlyMap<NoteGroupingId, string> {
  const visible = new Map<NoteGroupingId, string>();
  for (const [id, color] of GROUPING_COLORS) {
    if (NoteGroupingLibrary.getGroupingById(id).isVisiblePreset) {
      visible.set(id, color);
    }
  }
  return visible;
}
