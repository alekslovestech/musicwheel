import { ChordProgression } from "@/types/ChordProgressions/ChordProgression";
import {
  BarRow,
  COLUMNS_PER_BAR,
} from "@/types/ChordProgressions/ChordProgressionFormattingTypes";
import { RomanChordFormatter } from "./RomanChordFormatter";

export class ChordProgressionFormatter {
  /** Progression-style roman labels formatted as bar tokens for UI rendering. */
  static formatForDisplay(progression: ChordProgression): BarRow[] {
    const bars: BarRow[] = [];

    // 4/4 bars: 4 quarter-note beats per bar.
    // `noteLength` is LilyPond-style denominator: 4=quarter (1 beat), 2=half (2 beats), 1=whole (4 beats), 8=eighth (0.5 beat), etc.
    // Render grid at 16th-note resolution: 16 columns per bar.
    // colSpan = 16 / noteLength (e.g. :4 => 4 cols, :2 => 8 cols, :1 => 16 cols, :8 => 2 cols, :16 => 1 col)
    let colsInBar = 0;
    let barTokens: BarRow = [];

    for (const entry of progression.progression) {
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

      barTokens.push({ label, colSpan });
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
