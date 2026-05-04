import { ChordProgression } from "@/types/ChordProgressions/ChordProgression";
import { ChordProgressionFormatter } from "@/utils/formatters/ChordProgressionFormatter";

const indices = (bar: readonly { progressionEntryIndex: number }[]) =>
  bar.map((t) => t.progressionEntryIndex);

describe("ChordProgressionFormatter.formatForDisplay progressionEntryIndex", () => {
  it("assigns indices 0..n-1 for one bar of quarter chords", () => {
    const p = new ChordProgression(["I", "vi", "IV", "V"], "50s");
    const bars = new ChordProgressionFormatter(p).formatForDisplay();
    expect(bars).toHaveLength(1);
    expect(indices(bars[0])).toEqual([0, 1, 2, 3]);
  });

  it("preserves progressionEntryIndex across bar lines", () => {
    const p = new ChordProgression(["I:1", "IV:1"], "two wholes");
    const bars = new ChordProgressionFormatter(p).formatForDisplay();
    expect(bars).toHaveLength(2);
    expect(bars[0][0].progressionEntryIndex).toBe(0);
    expect(bars[1][0].progressionEntryIndex).toBe(1);
  });

  it("splits dotted-note progression into correct bars", () => {
    const p = new ChordProgression(
      ["i:4", "i:8.", "v:8.", "v:8.", "v:8.", "VI:4", "VI:8.", "VII:8.", "VII:8.", "VII:8."],
      "around the world",
    );
    const bars = new ChordProgressionFormatter(p).formatForDisplay();
    expect(bars).toHaveLength(2);
    expect(indices(bars[0])).toEqual([0, 1, 2, 3, 4]);
    expect(indices(bars[1])).toEqual([5, 6, 7, 8, 9]);
  });
});

describe("ChordProgressionFormatter.groupProgressionEntryIndicesIntoBars", () => {
  it("matches formatForDisplay bar boundaries", () => {
    const p = new ChordProgression(["I", "vi", "IV", "V"], "50s");
    const fmt = new ChordProgressionFormatter(p);
    const fromDisplay = fmt.formatForDisplay().map((bar) => indices(bar));
    expect(fmt.progressionEntryIndicesByBar).toEqual(fromDisplay);
  });

  it("finds the bar containing a progression step", () => {
    const p = new ChordProgression(["I:1", "IV:1"], "two wholes");
    const fmt = new ChordProgressionFormatter(p);
    expect(fmt.findBarIndexContainingStep(0)).toBe(0);
    expect(fmt.findBarIndexContainingStep(1)).toBe(1);
  });
});
