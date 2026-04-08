import { ChordDisplayMode } from "@/types/SettingModes";

import { MusicalKey } from "@/types/Keys/MusicalKey";
import { ChordProgression } from "@/types/ChordProgressions/ChordProgression";
import {
  ChordProgressionBar,
  COLUMNS_PER_BAR,
  type ChordProgressionBarGrid,
} from "@/types/ChordProgressions/ChordProgressionFormattingTypes";
import { MusicalDisplayFormatter } from "@/utils/formatters/MusicalDisplayFormatter";
import { ChordProgressionResolver } from "@/utils/resolvers/ChordProgressionResolver";
import { RomanChordFormatter } from "./RomanChordFormatter";

export class ChordProgressionFormatter {
  readonly progressionEntryIndicesByBar: number[][];

  constructor(private readonly progression: ChordProgression) {
    this.progressionEntryIndicesByBar = this.buildEntryIndicesByBar();
  }

  /** Resolved chord names in the given key, as bar tokens for the progression grid. */
  formatAbsoluteForDisplay(musicalKey: MusicalKey): ChordProgressionBarGrid {
    const romanChords = this.progression.progression.map((e) => e.value);
    const noteIndices = ChordProgressionResolver.computeProgressionOctaves(
      romanChords,
      musicalKey,
    );

    const labels = noteIndices.map((indices) => {
      return MusicalDisplayFormatter.getDisplayInfoFromIndices(
        indices,
        ChordDisplayMode.Symbols,
        musicalKey,
      ).chordName;
    });

    return this.buildBarRowsForDisplay(labels);
  }

  /** Bar index whose grouped row contains this progression step; `0` if none (should not happen for valid indices). */
  findBarIndexContainingStep(progressionEntryIndex: number): number {
    const bars = this.progressionEntryIndicesByBar;
    for (let b = 0; b < bars.length; b++) {
      if (bars[b].includes(progressionEntryIndex)) return b;
    }
    return 0;
  }

  /** Progression-style roman labels formatted as bar tokens for UI rendering. */
  formatForDisplay(): ChordProgressionBarGrid {
    const labels = this.progression.progression.map((entry) =>
      RomanChordFormatter.formatRomanChord(entry.value),
    );
    return this.buildBarRowsForDisplay(labels);
  }

  /** Static grid lane (no read head): progression-style roman labels. */
  private buildEntryIndicesByBar(): number[][] {
    const labels = Array(this.progression.progression.length).fill("");
    return this.buildBarRowsForDisplay(labels).map((row) =>
      row.map((t) => t.progressionEntryIndex),
    );
  }

  private buildBarRowsForDisplay(
    labelsByIndex: ReadonlyArray<string>,
  ): ChordProgressionBarGrid {
    const { progression } = this;
    let bars: ChordProgressionBarGrid = [];
    let colsInBar = 0;
    let barTokens: ChordProgressionBar = [];

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
      const label = labelsByIndex[progressionEntryIndex];

      if (colsInBar > 0 && colsInBar + colSpan > COLUMNS_PER_BAR) {
        bars = [...bars, [...barTokens]];
        barTokens = [];
        colsInBar = 0;
      }

      barTokens = [...barTokens, { label, colSpan, progressionEntryIndex }];
      colsInBar += colSpan;

      if (colsInBar === COLUMNS_PER_BAR) {
        bars = [...bars, [...barTokens]];
        barTokens = [];
        colsInBar = 0;
      }
    }

    if (barTokens.length > 0) {
      bars = [...bars, [...barTokens]];
    }

    return bars;
  }
}
