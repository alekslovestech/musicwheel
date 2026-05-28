import { ChordType } from "@/types/enums/ChordType";
import { NoteGroupingId } from "@/types/NoteGroupingId";
import { NoteGroupingLibrary } from "@/types/NoteGroupingLibrary";

/** Spread and narrow voicings are omitted from the legend. */
export const COLOR_LEGEND_EXCLUDED_CHORD_IDS: ReadonlySet<NoteGroupingId> = new Set([
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
]);

export function isColorLegendExcluded(id: NoteGroupingId): boolean {
  return COLOR_LEGEND_EXCLUDED_CHORD_IDS.has(id);
}

/** All catalog intervals (including octave). */
export const COLOR_LEGEND_INTERVAL_DISPLAY_IDS: NoteGroupingId[] =
  NoteGroupingLibrary.IntervalOrChordIds(true);

/** Visible-preset chords minus spread/narrow variants. */
export const COLOR_LEGEND_CHORD_DISPLAY_IDS: NoteGroupingId[] =
  NoteGroupingLibrary.IntervalOrChordIds(false).filter(
    (id) =>
      !isColorLegendExcluded(id) &&
      NoteGroupingLibrary.getGroupingById(id).isVisiblePreset,
  );

export const COLOR_LEGEND_DISPLAY_IDS: NoteGroupingId[] = [
  ...COLOR_LEGEND_INTERVAL_DISPLAY_IDS,
  ...COLOR_LEGEND_CHORD_DISPLAY_IDS,
];
