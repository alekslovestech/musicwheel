import { NoteGroupingId } from "../NoteGroupingId";

/** 16 columns per 4/4 bar at sixteenth-note grid resolution. */
export const COLUMNS_PER_BAR = 16;

/** Max chord steps per row in compact (pattern) display. */
export const COMPACT_PATTERN_TOKENS_PER_LINE = 4;

/** Bar/compact rows shown in the progression display during playback. */
export const CP_PLAYBACK_DISPLAY_ROW_COUNT = 2;

export type FormattedBarToken = {
  /** Roman numeral label for the chord step. */
  label: string;
  /** Resolved chord name in the current key; shown below `label` when present. */
  absoluteLabel?: string;
  /** Number of 16th-note columns to span (4/4 bar = 16 columns). */
  colSpan: number;
  /** Index into `ChordProgression.progression` for this chord step (playback / highlight). */
  progressionEntryIndex: number;
  /** Catalog id for chord quality (typically {@link ChordType}). */
  groupingId: NoteGroupingId;
};

export type ChordProgressionBar = readonly FormattedBarToken[];

export type ChordProgressionBarGrid = readonly FormattedBarToken[][];
