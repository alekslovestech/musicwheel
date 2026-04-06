/** 16 columns per 4/4 bar at sixteenth-note grid resolution. */
export const COLUMNS_PER_BAR = 16;

export type FormattedBarToken = {
  label: string;
  /** Number of 16th-note columns to span (4/4 bar = 16 columns). */
  colSpan: number;
  /** Index into `ChordProgression.progression` for this chord step (playback / highlight). */
  progressionEntryIndex: number;
};

/** One grid lane (e.g. roman or absolute): bar rows plus that lane’s read head. */
export class ChordProgressionGridLane {
  constructor(
    readonly rows: readonly FormattedBarToken[][],
    readonly readHeadStepIndex: number | null,
  ) {}

  withReadHead(index: number | null): ChordProgressionGridLane {
    return new ChordProgressionGridLane(this.rows, index);
  }
}
