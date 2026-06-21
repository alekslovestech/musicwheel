import { ChordDisplayMode } from "@/types/enums/SettingModes";

import { ChordType } from "@/types/enums/ChordType";
import { MusicalKey } from "@/types/Keys/MusicalKey";
import { NoteGroupingId } from "@/types/NoteGroupingId";
import { ChordProgression } from "@/types/ChordProgressions/ChordProgression";
import {
  COLUMNS_PER_BAR,
  COMPACT_PATTERN_TOKENS_PER_LINE,
  type ChordProgressionBarGrid,
  type FormattedBarToken,
} from "@/types/ChordProgressions/ChordProgressionFormattingTypes";
import { MusicalDisplayFormatter } from "@/utils/formatters/MusicalDisplayFormatter";
import { ChordProgressionResolver } from "@/utils/resolvers/ChordProgressionResolver";
import { RhythmUtils } from "@/utils/RhythmUtils";
import { RomanChordFormatter } from "./RomanChordFormatter";

type MutableChordProgressionBar = FormattedBarToken[];
type MutableChordProgressionBarGrid = FormattedBarToken[][];

export class ChordProgressionFormatter {
  readonly progressionEntryIndicesByBar: number[][];
  readonly progressionEntryIndicesByCompactRow: number[][];

  constructor(private readonly progression: ChordProgression) {
    this.progressionEntryIndicesByBar = this.buildEntryIndicesByBar();
    this.progressionEntryIndicesByCompactRow = this.buildEntryIndicesByCompactRow();
  }

  /** Roman numerals with resolved chord names stacked in each cell. */
  formatCombinedForDisplay(musicalKey: MusicalKey): ChordProgressionBarGrid {
    const romanLabels = this.getRomanLabels();
    return this.buildBarRowsForDisplay(romanLabels, this.getAbsoluteLabels(musicalKey));
  }

  /** Equal-width cells, up to {@link COMPACT_PATTERN_TOKENS_PER_LINE} steps per row. */
  formatCompactForDisplay(musicalKey: MusicalKey): ChordProgressionBarGrid {
    const romanLabels = this.getRomanLabels();
    const absoluteLabels = this.getAbsoluteLabels(musicalKey);
    const tokens: FormattedBarToken[] = this.progression.progression.map((_, i) => ({
      label: romanLabels[i],
      absoluteLabel: absoluteLabels[i],
      colSpan: 1,
      progressionEntryIndex: i,
      groupingId: this.getGroupingIdForStep(i),
    }));

    const rows: MutableChordProgressionBarGrid = [];
    for (let i = 0; i < tokens.length; i += COMPACT_PATTERN_TOKENS_PER_LINE) {
      rows.push(tokens.slice(i, i + COMPACT_PATTERN_TOKENS_PER_LINE));
    }
    return rows;
  }

  formatForDisplay(musicalKey: MusicalKey, isCompact: boolean): ChordProgressionBarGrid {
    return isCompact
      ? this.formatCompactForDisplay(musicalKey)
      : this.formatCombinedForDisplay(musicalKey);
  }

  getGroupingIdForStep(progressionEntryIndex: number): NoteGroupingId {
    return (
      this.progression.progression[progressionEntryIndex]?.value.chordType ?? ChordType.Unknown
    );
  }

  private getRomanLabels(): string[] {
    return this.progression.progression.map((entry) =>
      RomanChordFormatter.formatRomanChord(entry.value),
    );
  }

  /** Bar index whose grouped row contains this progression step; `0` if none (should not happen for valid indices). */
  findBarIndexContainingStep(progressionEntryIndex: number): number {
    const bars = this.progressionEntryIndicesByBar;
    for (let b = 0; b < bars.length; b++) {
      if (bars[b].includes(progressionEntryIndex)) return b;
    }
    return 0;
  }

  /** Compact display row index (same chunking as {@link formatCompactForDisplay}). */
  findCompactRowIndexContainingStep(progressionEntryIndex: number): number {
    const rows = this.progressionEntryIndicesByCompactRow;
    for (let r = 0; r < rows.length; r++) {
      if (rows[r].includes(progressionEntryIndex)) return r;
    }
    return 0;
  }

  stepIndicesForDisplayRow(progressionEntryIndex: number, isCompact: boolean): number[] {
    if (isCompact) {
      const rowIndex = this.findCompactRowIndexContainingStep(progressionEntryIndex);
      return this.progressionEntryIndicesByCompactRow[rowIndex] ?? [];
    }
    const barIndex = this.findBarIndexContainingStep(progressionEntryIndex);
    return this.progressionEntryIndicesByBar[barIndex] ?? [];
  }

  /** Sliding window of display rows anchored on the active progression step. */
  displayRowsForStep(
    grid: ChordProgressionBarGrid,
    progressionEntryIndex: number,
    isCompact: boolean,
    rowCount: number,
  ): ChordProgressionBarGrid {
    if (grid.length === 0 || rowCount <= 0) return [];

    const rowIndex = isCompact
      ? this.findCompactRowIndexContainingStep(progressionEntryIndex)
      : this.findBarIndexContainingStep(progressionEntryIndex);
    const count = Math.min(rowCount, grid.length);
    const start = Math.max(0, Math.min(rowIndex, grid.length - count));
    return grid.slice(start, start + count);
  }

  private buildEntryIndicesByCompactRow(): number[][] {
    const length = this.progression.progression.length;
    const rows: number[][] = [];
    for (let i = 0; i < length; i += COMPACT_PATTERN_TOKENS_PER_LINE) {
      rows.push(
        Array.from(
          { length: Math.min(COMPACT_PATTERN_TOKENS_PER_LINE, length - i) },
          (_, offset) => i + offset,
        ),
      );
    }
    return rows;
  }

  private buildEntryIndicesByBar(): number[][] {
    const labels = Array(this.progression.progression.length).fill("");
    return this.buildBarRowsForDisplay(labels).map((row) =>
      row.map((t) => t.progressionEntryIndex),
    );
  }

  private getAbsoluteLabels(musicalKey: MusicalKey): string[] {
    const romanChords = this.progression.progression.map((e) => e.value);
    const noteIndices = ChordProgressionResolver.computeProgressionOctaves(romanChords, musicalKey);

    return noteIndices.map(
      (indices) =>
        MusicalDisplayFormatter.getDisplayInfoFromIndices(
          indices,
          ChordDisplayMode.Symbols,
          musicalKey,
        ).chordName,
    );
  }

  private buildBarRowsForDisplay(
    labelsByIndex: ReadonlyArray<string>,
    absoluteLabelsByIndex?: ReadonlyArray<string>,
  ): ChordProgressionBarGrid {
    const { progression } = this;
    let bars: MutableChordProgressionBarGrid = [];
    let colsInBar = 0;
    let barTokens: MutableChordProgressionBar = [];

    const flushBar = () => {
      if (barTokens.length === 0) return;
      bars.push(barTokens);
      barTokens = [];
      colsInBar = 0;
    };

    for (
      let progressionEntryIndex = 0;
      progressionEntryIndex < progression.progression.length;
      progressionEntryIndex++
    ) {
      const entry = progression.progression[progressionEntryIndex];
      if (entry.noteLength === undefined) {
        throw new Error("ChordProgression entries are expected to have carried noteLength applied");
      }

      const colSpan = RhythmUtils.colSpan(entry.noteLength, entry.rhythmDots, COLUMNS_PER_BAR);
      const label = labelsByIndex[progressionEntryIndex];

      if (colsInBar > 0 && colsInBar + colSpan > COLUMNS_PER_BAR) flushBar();

      barTokens.push({
        label,
        absoluteLabel: absoluteLabelsByIndex?.[progressionEntryIndex],
        colSpan,
        progressionEntryIndex,
        groupingId: entry.value.chordType,
      });
      colsInBar += colSpan;

      if (colsInBar === COLUMNS_PER_BAR) flushBar();
    }

    flushBar();

    return bars;
  }
}
