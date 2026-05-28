import { ChordType } from "@/types/enums/ChordType";
import { ChordProgression } from "@/types/ChordProgressions/ChordProgression";
import { ChordProgressionFormatter } from "@/utils/formatters/ChordProgressionFormatter";
import { chordActiveHighlightFor } from "@/utils/visual/NoteGroupingColorRegistry";

const indices = (bar: readonly { progressionEntryIndex: number }[]) =>
  bar.map((t) => t.progressionEntryIndex);

describe("ChordProgressionFormatter.formatCombinedForDisplay", () => {
  it("assigns indices 0..n-1 for one bar of quarter chords", () => {
    const p = new ChordProgression(["I", "vi", "IV", "V"], "50s");
    const bars = new ChordProgressionFormatter(p).formatCombinedForDisplay(p.suggestedMusicalKey);
    expect(bars).toHaveLength(1);
    expect(indices(bars[0])).toEqual([0, 1, 2, 3]);
  });

  it("preserves progressionEntryIndex across bar lines", () => {
    const p = new ChordProgression(["I:1", "IV:1"], "two wholes");
    const bars = new ChordProgressionFormatter(p).formatCombinedForDisplay(p.suggestedMusicalKey);
    expect(bars).toHaveLength(2);
    expect(bars[0][0].progressionEntryIndex).toBe(0);
    expect(bars[1][0].progressionEntryIndex).toBe(1);
  });

  it("splits dotted-note progression into correct bars", () => {
    const p = new ChordProgression(
      ["i:4", "i:8.", "v:8.", "v:8.", "v:8.", "VI:4", "VI:8.", "VII:8.", "VII:8.", "VII:8."],
      "around the world",
    );
    const bars = new ChordProgressionFormatter(p).formatCombinedForDisplay(p.suggestedMusicalKey);
    expect(bars).toHaveLength(2);
    expect(indices(bars[0])).toEqual([0, 1, 2, 3, 4]);
    expect(indices(bars[1])).toEqual([5, 6, 7, 8, 9]);
  });

  it("stacks roman and absolute labels on each token", () => {
    const p = new ChordProgression(["I", "vi", "IV", "V"], "50s");
    const bars = new ChordProgressionFormatter(p).formatCombinedForDisplay(p.suggestedMusicalKey);
    expect(bars[0]).toHaveLength(4);
    expect(bars[0][0].label).toBe("I");
    expect(bars[0][0].absoluteLabel).toBeTruthy();
    expect(bars[0][1].label).toBe("vi");
    expect(bars[0][1].absoluteLabel).toBeTruthy();
  });

  it("assigns chord-quality grouping ids to each token", () => {
    const p = new ChordProgression(["I", "vi", "IV", "V7"], "50s");
    const bars = new ChordProgressionFormatter(p).formatCombinedForDisplay(p.suggestedMusicalKey);
    expect(bars[0][0].groupingId).toBe(ChordType.Major);
    expect(bars[0][1].groupingId).toBe(ChordType.Minor);
    expect(bars[0][3].groupingId).toBe(ChordType.Dominant7);
  });
});

describe("ChordProgressionFormatter.formatCompactForDisplay", () => {
  it("fits whole-note cadence on one row", () => {
    const p = new ChordProgression(["V:1", "I"], "cadence");
    const rows = new ChordProgressionFormatter(p).formatCompactForDisplay(p.suggestedMusicalKey);
    expect(rows).toHaveLength(1);
    expect(indices(rows[0])).toEqual([0, 1]);
    expect(rows[0].every((t) => t.colSpan === 1)).toBe(true);
  });

  it("wraps after four steps", () => {
    const p = new ChordProgression(["I", "ii", "iii", "IV", "V", "vi", "vii"], "scale");
    const rows = new ChordProgressionFormatter(p).formatCompactForDisplay(p.suggestedMusicalKey);
    expect(rows).toHaveLength(2);
    expect(indices(rows[0])).toEqual([0, 1, 2, 3]);
    expect(indices(rows[1])).toEqual([4, 5, 6]);
  });

  it("stacks roman and absolute labels on each token", () => {
    const p = new ChordProgression(["I:1", "IV:1"], "two wholes");
    const rows = new ChordProgressionFormatter(p).formatCompactForDisplay(p.suggestedMusicalKey);
    expect(rows[0][0].label).toBe("I");
    expect(rows[0][0].absoluteLabel).toBeTruthy();
    expect(rows[0][1].label).toBe("IV");
  });

  it("assigns chord-quality grouping ids to each token", () => {
    const p = new ChordProgression(["I:1", "IV:1"], "two wholes");
    const rows = new ChordProgressionFormatter(p).formatCompactForDisplay(p.suggestedMusicalKey);
    expect(rows[0][0].groupingId).toBe(ChordType.Major);
    expect(rows[0][1].groupingId).toBe(ChordType.Major);
  });
});

describe("ChordProgressionFormatter.formatForDisplay", () => {
  it("uses compact rows when isCompact is true", () => {
    const p = new ChordProgression(["I:1", "IV:1"], "two wholes");
    const fmt = new ChordProgressionFormatter(p);
    expect(fmt.formatForDisplay(p.suggestedMusicalKey, true)).toHaveLength(1);
    expect(fmt.formatForDisplay(p.suggestedMusicalKey, false)).toHaveLength(2);
  });
});

describe("ChordProgressionFormatter.groupProgressionEntryIndicesIntoBars", () => {
  it("matches formatCombinedForDisplay bar boundaries", () => {
    const p = new ChordProgression(["I", "vi", "IV", "V"], "50s");
    const fmt = new ChordProgressionFormatter(p);
    const fromDisplay = fmt
      .formatCombinedForDisplay(p.suggestedMusicalKey)
      .map((bar) => indices(bar));
    expect(fmt.progressionEntryIndicesByBar).toEqual(fromDisplay);
  });

  it("finds the bar containing a progression step", () => {
    const p = new ChordProgression(["I:1", "IV:1"], "two wholes");
    const fmt = new ChordProgressionFormatter(p);
    expect(fmt.findBarIndexContainingStep(0)).toBe(0);
    expect(fmt.findBarIndexContainingStep(1)).toBe(1);
  });
});

describe("ChordProgressionFormatter.compact row grouping", () => {
  it("matches formatCompactForDisplay row boundaries", () => {
    const p = new ChordProgression(["I", "ii", "iii", "IV", "V", "vi", "vii"], "scale");
    const fmt = new ChordProgressionFormatter(p);
    const fromDisplay = fmt
      .formatCompactForDisplay(p.suggestedMusicalKey)
      .map((row) => indices(row));
    expect(fmt.progressionEntryIndicesByCompactRow).toEqual(fromDisplay);
  });

  it("finds the compact row containing a progression step", () => {
    const p = new ChordProgression(["I", "ii", "iii", "IV", "V", "vi", "vii"], "scale");
    const fmt = new ChordProgressionFormatter(p);
    expect(fmt.findCompactRowIndexContainingStep(3)).toBe(0);
    expect(fmt.findCompactRowIndexContainingStep(4)).toBe(1);
  });

  it("returns compact or bar step indices for display", () => {
    const p = new ChordProgression(["I:1", "IV:1"], "two wholes");
    const fmt = new ChordProgressionFormatter(p);
    expect(fmt.stepIndicesForDisplayRow(1, true)).toEqual([0, 1]);
    expect(fmt.stepIndicesForDisplayRow(1, false)).toEqual([1]);
  });
});

describe("ChordProgressionFormatter step grouping lookup", () => {
  it("exposes grouping id and active highlight for a step", () => {
    const p = new ChordProgression(["I", "V7"], "test");
    const fmt = new ChordProgressionFormatter(p);
    expect(fmt.getGroupingIdForStep(1)).toBe(ChordType.Dominant7);
    expect(fmt.getActiveHighlightForStep(1)).toBe(chordActiveHighlightFor(ChordType.Dominant7));
  });
});
