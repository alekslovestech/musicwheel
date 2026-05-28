import { ChordType } from "@/types/enums/ChordType";
import { IntervalType } from "@/types/enums/IntervalType";
import { SpecialType } from "@/types/enums/SpecialType";
import { isIntervalType, NoteGroupingId } from "@/types/NoteGroupingId";
import { NoteGroupingLibrary } from "@/types/NoteGroupingLibrary";

/** Spread, narrow, and hidden voicings omitted from the chord legend. */
const COLOR_LEGEND_EXCLUDED_CHORD_IDS: ReadonlySet<NoteGroupingId> = new Set([
  ChordType.SpreadMajor,
  ChordType.SpreadMinor,
  ChordType.SpreadAugmented,
  ChordType.SpreadDiminished,
  ChordType.Narrow23,
  ChordType.Narrow24,
  ChordType.Narrow34,
  ChordType.Narrow24sharp,
  ChordType.Narrow3flat4,
  ChordType.MajFlat5,
  ChordType.Add2,
  ChordType.Seven13,
]);

/** Intervals and chords included in the color legend and equivalence catalog. */
export function isColorLegendId(id: NoteGroupingId): boolean {
  if (id === SpecialType.None || id === SpecialType.Note) return false;
  if (isIntervalType(id)) return id !== IntervalType.Octave;
  return !COLOR_LEGEND_EXCLUDED_CHORD_IDS.has(id);
}

export const COLOR_LEGEND_DISPLAY_IDS: NoteGroupingId[] =
  NoteGroupingLibrary.getAllIds().filter(isColorLegendId);
