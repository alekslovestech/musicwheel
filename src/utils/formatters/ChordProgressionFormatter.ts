import { MusicalKey } from "@/types/Keys/MusicalKey";
import { ChordDisplayMode } from "@/types/SettingModes";
import { ChordProgression } from "@/types/ChordProgressions/ChordProgression";
import {
  COLUMNS_PER_BAR,
  type FormattedBarToken,
} from "@/types/ChordProgressions/ChordProgressionFormattingTypes";
import { MusicalDisplayFormatter } from "@/utils/formatters/MusicalDisplayFormatter";
import { ChordProgressionResolver } from "@/utils/resolvers/ChordProgressionResolver";
import { RomanChordFormatter } from "./RomanChordFormatter";

type ProgressionEntry = ChordProgression["progression"][number];

export class ChordProgressionFormatter {
  readonly progressionEntryIndicesByBar: number[][];

  constructor(private readonly progression: ChordProgression) {
    this.progressionEntryIndicesByBar = this.buildBarRowsForDisplay(
      () => "",
    ).map((row) => row.map((t) => t.progressionEntryIndex));
  }

  private buildBarRowsForDisplay(
    labelAtIndex: (
      entry: ProgressionEntry,
      progressionEntryIndex: number,
    ) => string,
  ): FormattedBarToken[][] {
    const { progression } = this;
    const bars: FormattedBarToken[][] = [];
    let colsInBar = 0;
    let barTokens: FormattedBarToken[] = [];

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
      const label = labelAtIndex(entry, progressionEntryIndex);

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

  /** Resolved chord names in the given key, as bar tokens for the progression grid. */
  formatAbsoluteForDisplay(
    musicalKey: MusicalKey,
    chordDisplayMode: ChordDisplayMode,
  ): FormattedBarToken[][] {
    const { progression } = this;
    const romanChords = progression.progression.map((e) => e.value);
    const resolvedNoteArrays =
      ChordProgressionResolver.computeProgressionOctaves(
        romanChords,
        musicalKey,
      );
    return this.buildBarRowsForDisplay((_entry, i) => {
      const indices = resolvedNoteArrays[i] ?? [];
      return MusicalDisplayFormatter.getDisplayInfoFromIndices(
        indices,
        chordDisplayMode,
        musicalKey,
      ).chordName;
    });
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
  formatForDisplay(): FormattedBarToken[][] {
    return this.buildBarRowsForDisplay((entry) =>
      RomanChordFormatter.formatRomanChord(entry.value),
    );
  }
}
