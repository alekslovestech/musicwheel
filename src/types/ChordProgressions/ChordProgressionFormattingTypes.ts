/** 16 columns per 4/4 bar at sixteenth-note grid resolution. */
export const COLUMNS_PER_BAR = 16;

export type FormattedBarToken = {
  /** Roman numeral label for the chord step. */
  label: string;
  /** Resolved chord name in the current key; shown below `label` when present. */
  absoluteLabel?: string;
  /** Number of 16th-note columns to span (4/4 bar = 16 columns). */
  colSpan: number;
  /** Index into `ChordProgression.progression` for this chord step (playback / highlight). */
  progressionEntryIndex: number;
};

export type ChordProgressionBar = readonly FormattedBarToken[];

export type ChordProgressionBarGrid = readonly FormattedBarToken[][];
