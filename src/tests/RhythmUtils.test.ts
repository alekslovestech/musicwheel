import { COLUMNS_PER_BAR } from "@/types/ChordProgressions/ChordProgressionFormattingTypes";
import { RhythmUtils } from "@/utils/RhythmUtils";

describe("RhythmUtils.dotMultiplier", () => {
  it("returns 1 for 0 dots (undotted)", () => {
    expect(RhythmUtils.dotMultiplier(0)).toBe(1);
  });

  it("returns 1.5 for 1 dot", () => {
    expect(RhythmUtils.dotMultiplier(1)).toBe(1.5);
  });

  it("returns 1.75 for 2 dots", () => {
    expect(RhythmUtils.dotMultiplier(2)).toBe(1.75);
  });
});

describe("RhythmUtils.colSpan", () => {
  it("returns undotted column span for 0 dots", () => {
    expect(RhythmUtils.colSpan(4, 0, COLUMNS_PER_BAR)).toBe(4);  // quarter
    expect(RhythmUtils.colSpan(8, 0, COLUMNS_PER_BAR)).toBe(2);  // eighth
    expect(RhythmUtils.colSpan(1, 0, COLUMNS_PER_BAR)).toBe(16); // whole
  });

  it("returns dotted column span for 1 dot", () => {
    expect(RhythmUtils.colSpan(4, 1, COLUMNS_PER_BAR)).toBe(6);  // dotted quarter
    expect(RhythmUtils.colSpan(8, 1, COLUMNS_PER_BAR)).toBe(3);  // dotted eighth
    expect(RhythmUtils.colSpan(2, 1, COLUMNS_PER_BAR)).toBe(12); // dotted half
  });

  it("4/4 bar filled exactly by 5-note Around-The-World pattern", () => {
    const bar = [
      RhythmUtils.colSpan(4, 0, COLUMNS_PER_BAR),  // i:4
      RhythmUtils.colSpan(8, 1, COLUMNS_PER_BAR),  // i:8.
      RhythmUtils.colSpan(8, 1, COLUMNS_PER_BAR),  // v:8.
      RhythmUtils.colSpan(8, 1, COLUMNS_PER_BAR),  // v:8.
      RhythmUtils.colSpan(8, 1, COLUMNS_PER_BAR),  // v:8.
    ];
    expect(bar.reduce((a, b) => a + b, 0)).toBe(COLUMNS_PER_BAR);
  });
});

describe("RhythmUtils.chordDurationMs", () => {
  it("quarter note at 120 BPM lasts 500 ms", () => {
    expect(RhythmUtils.chordDurationMs(120, 4, 0)).toBe(500);
  });

  it("whole note at 120 BPM lasts 2000 ms", () => {
    expect(RhythmUtils.chordDurationMs(120, 1, 0)).toBe(2000);
  });

  it("dotted quarter at 120 BPM lasts 750 ms", () => {
    expect(RhythmUtils.chordDurationMs(120, 4, 1)).toBe(750);
  });

  it("dotted eighth at 120 BPM lasts 375 ms", () => {
    expect(RhythmUtils.chordDurationMs(120, 8, 1)).toBe(375);
  });
});
