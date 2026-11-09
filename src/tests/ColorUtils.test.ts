import { toNoteIndices } from "@/types/IndexTypes";
import { expectDistinctColors, expectEqualColors } from "@/tests/utils/ColorTestUtils";
import {
  ColorUtils,
  INTERVAL_CLASS_DISSONANCE,
  ORDER_WEIGHT_MAX,
} from "@/utils/visual/ColorUtils";

describe("ColorUtils.getColorForSemitoneDistance", () => {
  it("P4 and P5 (IC 5) produce the same color", () => {
    expectEqualColors(ColorUtils.getColorForSemitoneDistance(5), ColorUtils.getColorForSemitoneDistance(7));
  });

  it("m2 and M7 (IC 1) produce the same color", () => {
    expectEqualColors(ColorUtils.getColorForSemitoneDistance(1), ColorUtils.getColorForSemitoneDistance(11));
  });
});

describe("ColorUtils.getChordColorTerms", () => {
  it("lists a triad's gaps from the smallest, in the order the mix weighs them", () => {
    const major = ColorUtils.getChordColorTerms(toNoteIndices([0, 4, 7]));
    const minor = ColorUtils.getChordColorTerms(toNoteIndices([0, 3, 7]));
    expect(major.map((term) => term.semitones)).toEqual([3, 5, 4]);
    expect(minor.map((term) => term.semitones)).toEqual([3, 4, 5]);
  });

  it("gives every transposition of a chord with tied smallest gaps the same terms and color", () => {
    // Cadd9 [0, 2, 4, 7] has 2 gaps of 2; starting at the first of them depends on the root
    const base = [0, 2, 4, 7];
    const expectedTerms = ColorUtils.getChordColorTerms(toNoteIndices(base)).map(
      (term) => term.semitones,
    );
    const expectedColor = ColorUtils.getColorForIndices(toNoteIndices(base));
    for (let root = 1; root < 12; root++) {
      const notes = toNoteIndices(base.map((note) => (note + root) % 12));
      expect(ColorUtils.getChordColorTerms(notes).map((term) => term.semitones)).toEqual(
        expectedTerms,
      );
      expectEqualColors(ColorUtils.getColorForIndices(notes), expectedColor);
    }
  });

  it("adds the diagonals for 4 or more notes", () => {
    // Maj7 [0, 4, 7, 11]: gaps [1, 4, 3, 4], then the spans across 2 gaps from the smallest, sorted
    const terms = ColorUtils.getChordColorTerms(toNoteIndices([0, 4, 7, 11]));
    expect(terms.map((term) => term.semitones)).toEqual([1, 4, 3, 4, 5, 7]);
  });

  it("weighs the first consonant gap most and an unstable interval by its dissonance", () => {
    const [first, , last] = ColorUtils.getChordColorTerms(toNoteIndices([0, 4, 7]));
    expect(first.orderWeight).toBeCloseTo(ORDER_WEIGHT_MAX);
    expect(last.orderWeight).toBe(0);
    const [m2] = ColorUtils.getChordColorTerms(toNoteIndices([0, 1, 5]));
    expect(m2.dissonanceWeight).toBeCloseTo(1 + INTERVAL_CLASS_DISSONANCE[1]);
    expect(m2.orderWeight).toBe(0);
  });

  it("has no terms for a single note", () => {
    expect(ColorUtils.getChordColorTerms(toNoteIndices([0]))).toEqual([]);
  });
});

describe("ColorUtils.getColorForIndices", () => {
  describe("interval and inverse resolve to the same color", () => {
    it("P4 and P5 (IC 5) produce the same color", () => {
      // Two-note chords: [0, 5] = P4, [0, 7] = P5 — both interval class 5
      const colorP4 = ColorUtils.getColorForIndices(toNoteIndices([0, 5]));
      const colorP5 = ColorUtils.getColorForIndices(toNoteIndices([0, 7]));
      expectEqualColors(colorP4, colorP5);
    });

    it("m2 and M7 (IC 1) produce the same color", () => {
      // [0, 1] = m2, [0, 11] = M7 — both interval class 1
      const colorM2 = ColorUtils.getColorForIndices(toNoteIndices([0, 1]));
      const colorM7 = ColorUtils.getColorForIndices(toNoteIndices([0, 11]));
      expectEqualColors(colorM2, colorM7);
    });
  });

  describe("triads", () => {
    it("color(sus2) = color(sus4)", () => {
      // sus2 [0, 2, 7] and sus4 [0, 5, 7] both yield cyclic intervals [2, 5, 5] (IC 2 + two IC 5)
      const colorSus2 = ColorUtils.getColorForIndices(toNoteIndices([0, 2, 7]));
      const colorSus4 = ColorUtils.getColorForIndices(toNoteIndices([0, 5, 7]));
      expectEqualColors(colorSus2, colorSus4);
    });

    it("color(major) = color(major 1st inversion), e.g. color(C) = color(C/E)", () => {
      // Root [0, 4, 7] and 1st inversion [4, 0, 7] (E G C) both yield cyclic intervals [3, 5, 4]
      const colorRoot = ColorUtils.getColorForIndices(toNoteIndices([0, 4, 7]));
      const colorFirstInv = ColorUtils.getColorForIndices(toNoteIndices([4, 7, 12]));
      expectEqualColors(colorRoot, colorFirstInv);
    });

    it("color(major) = color(major 2nd inversion), e.g. color(C) = color(C/G)", () => {
      // Root [0, 4, 7] and 2nd inversion [7, 0, 4] (G C E) both yield cyclic intervals [4, 3, 5]
      const colorRoot = ColorUtils.getColorForIndices(toNoteIndices([0, 4, 7]));
      const colorSecondInv = ColorUtils.getColorForIndices(toNoteIndices([7, 12, 16]));
      expectEqualColors(colorRoot, colorSecondInv);
    });

    it("color(minor) ≠ color(major)", () => {
      // Major [0, 4, 7] → [3, 5, 4]; minor [0, 3, 7] → [3, 4, 5]; different order ⇒ different mix
      const colorMajor = ColorUtils.getColorForIndices(toNoteIndices([0, 4, 7]));
      const colorMinor = ColorUtils.getColorForIndices(toNoteIndices([0, 3, 7]));
      expectDistinctColors(colorMajor, colorMinor);
    });
  });

  describe("tetrachords", () => {
    it("color(ø7)=color(min6)", () => {
      // [0, 3, 6, 10] (ø7, half-diminished 7th): cyclic intervals [2, 3, 3, 4]
      // [0, 3, 7, 9] (min6): cyclic intervals [2, 3, 3, 4]
      const colorHalfDiminished7 = ColorUtils.getColorForIndices(toNoteIndices([0, 3, 6, 10]));
      const colorMin6 = ColorUtils.getColorForIndices(toNoteIndices([0, 3, 7, 9]));
      expectEqualColors(colorHalfDiminished7, colorMin6);
    });
    it("color(min7)=color(maj6)", () => {
      // [0, 3, 7, 10] (min7): cyclic intervals [2, 3, 4, 3]
      // [0, 4, 7, 9] (maj6): cyclic intervals [2, 3, 4, 3]
      const colorMin7 = ColorUtils.getColorForIndices(toNoteIndices([0, 3, 7, 10]));
      const colorMaj6 = ColorUtils.getColorForIndices(toNoteIndices([0, 4, 7, 9]));
      expectEqualColors(colorMin7, colorMaj6);
    });
    it("color of Maj7 is distinguishable from +Maj7", () => {
      // [0, 4, 7, 11] (Maj7): cyclic intervals [1, 4, 3, 4]
      // [0, 4, 8, 11] (+Maj7, augmented major seventh): cyclic intervals [1, 4, 4, 3]
      const colorMaj7 = ColorUtils.getColorForIndices(toNoteIndices([0, 4, 7, 11]));
      const colorPlusMaj7 = ColorUtils.getColorForIndices(toNoteIndices([0, 4, 8, 11]));
      expectDistinctColors(colorMaj7, colorPlusMaj7);
    });
  });
});
