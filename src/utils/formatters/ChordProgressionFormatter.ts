import { ChordProgression } from "@/types/ChordProgressions/ChordProgression";
import {
  BarRow,
  COLUMNS_PER_BAR,
} from "@/types/ChordProgressions/ChordProgressionFormattingTypes";
import { RomanChordFormatter } from "./RomanChordFormatter";

export class ChordProgressionFormatter {
  /** Progression entry indices grouped into 4/4 bars (same boundaries as the display grid). */
  static groupProgressionEntryIndicesIntoBars(
    progression: ChordProgression,
  ): number[][] {
    return ChordProgressionFormatter.formatForDisplay(progression).map((row) =>
      row.map((t) => t.progressionEntryIndex),
    );
  }

  /** Bar index whose grouped row contains this progression step; `0` if none (should not happen for valid indices). */
  static findBarIndexContainingStep(
    bars: number[][],
    progressionEntryIndex: number,
  ): number {
    for (let b = 0; b < bars.length; b++) {
      if (bars[b].includes(progressionEntryIndex)) return b;
    }
    return 0;
  }

  /** Progression-style roman labels formatted as bar tokens for UI rendering. */
  static formatForDisplay(progression: ChordProgression): BarRow[] {
    const bars: BarRow[] = [];

    // 4/4 bars: 4 quarter-note beats per bar.
    // `noteLength` is LilyPond-style denominator: 4=quarter (1 beat), 2=half (2 beats), 1=whole (4 beats), 8=eighth (0.5 beat), etc.
    // Render grid at 16th-note resolution: 16 columns per bar.
    // colSpan = 16 / noteLength (e.g. :4 => 4 cols, :2 => 8 cols, :1 => 16 cols, :8 => 2 cols, :16 => 1 col)
    let colsInBar = 0;
    let barTokens: BarRow = [];

    for (
      let progressionEntryIndex = 0;
      progressionEntryIndex < progression.progression.length;
      progressionEntryIndex++
    ) {
      const entry = progression.progression[progressionEntryIndex];
      if (entry.noteLength === undefined) {
        throw new Error(
          "ChordProgression entries are expected to have carried noteLength applied",
        );
      }

      const colSpan = COLUMNS_PER_BAR / entry.noteLength;
      const label = RomanChordFormatter.formatRomanChord(entry.value);

      if (colsInBar > 0 && colsInBar + colSpan > COLUMNS_PER_BAR) {
        bars.push(barTokens);
        barTokens = [];
        colsInBar = 0;
      }

      barTokens.push({ label, colSpan, progressionEntryIndex });
      colsInBar += colSpan;

      if (colsInBar === COLUMNS_PER_BAR) {
        bars.push(barTokens);
        barTokens = [];
        colsInBar = 0;
      }
    }

    if (barTokens.length > 0) {
      bars.push(barTokens);
    }

    return bars;
  }
}
