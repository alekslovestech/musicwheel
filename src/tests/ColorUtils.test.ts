import { toNoteIndices } from "@/types/IndexTypes";
import { ColorUtils } from "@/utils/visual/ColorUtils";

describe("ColorUtils.getChordColor", () => {
  describe("interval and inverse resolve to the same color", () => {
    it("P4 and P5 (IC 5) produce the same color", () => {
      // Two-note chords: [0, 5] = P4, [0, 7] = P5 — both interval class 5
      const colorP4 = ColorUtils.getChordColor(toNoteIndices([0, 5]));
      const colorP5 = ColorUtils.getChordColor(toNoteIndices([0, 7]));
      expect(colorP4).toBe(colorP5);
    });

    it("m2 and M7 (IC 1) produce the same color", () => {
      // [0, 1] = m2, [0, 11] = M7 — both interval class 1
      const colorM2 = ColorUtils.getChordColor(toNoteIndices([0, 1]));
      const colorM7 = ColorUtils.getChordColor(toNoteIndices([0, 11]));
      expect(colorM2).toBe(colorM7);
    });
  });

  describe("triads", () => {
    it("color(sus2) = color(sus4)", () => {
      // sus2 [0, 2, 7] and sus4 [0, 5, 7] both yield cyclic intervals [2, 5, 5] (IC 2 + two IC 5)
      const colorSus2 = ColorUtils.getChordColor(toNoteIndices([0, 2, 7]));
      const colorSus4 = ColorUtils.getChordColor(toNoteIndices([0, 5, 7]));
      expect(colorSus2).toBe(colorSus4);
    });

    it("color(major) = color(major 1st inversion), e.g. color(C) = color(C/E)", () => {
      // Root [0, 4, 7] and 1st inversion [4, 0, 7] (E G C) both yield cyclic intervals [3, 5, 4]
      const colorRoot = ColorUtils.getChordColor(toNoteIndices([0, 4, 7]));
      const colorFirstInv = ColorUtils.getChordColor(toNoteIndices([4, 7, 12]));
      expect(colorRoot).toBe(colorFirstInv);
    });

    it("color(major) = color(major 2nd inversion), e.g. color(C) = color(C/G)", () => {
      // Root [0, 4, 7] and 2nd inversion [7, 0, 4] (G C E) both yield cyclic intervals [4, 3, 5]
      const colorRoot = ColorUtils.getChordColor(toNoteIndices([0, 4, 7]));
      const colorSecondInv = ColorUtils.getChordColor(
        toNoteIndices([7, 12, 16]),
      );
      expect(colorRoot).toBe(colorSecondInv);
    });

    it("color(minor) ≠ color(major)", () => {
      // Major [0, 4, 7] → [3, 5, 4]; minor [0, 3, 7] → [3, 4, 5]; different order ⇒ different mix
      const colorMajor = ColorUtils.getChordColor(toNoteIndices([0, 4, 7]));
      const colorMinor = ColorUtils.getChordColor(toNoteIndices([0, 3, 7]));
      expect(colorMajor).not.toBe(colorMinor);
    });
  });

  describe("tetrachords", () => {
    it("color(ø7)=color(min6)", () => {
      // [0, 3, 6, 10] (ø7, half-diminished 7th): cyclic intervals [2, 3, 3, 4]
      // [0, 3, 7, 9] (min6): cyclic intervals [2, 3, 3, 4]
      const colorHalfDiminished7 = ColorUtils.getChordColor(
        toNoteIndices([0, 3, 6, 10]),
      );
      const colorMin6 = ColorUtils.getChordColor(toNoteIndices([0, 3, 7, 9]));
      expect(colorHalfDiminished7).toBe(colorMin6);
    });
    it("color(min7)=color(maj6)", () => {
      // [0, 3, 7, 10] (min7): cyclic intervals [2, 3, 4, 3]
      // [0, 4, 7, 9] (maj6): cyclic intervals [2, 3, 4, 3]
      const colorMin7 = ColorUtils.getChordColor(toNoteIndices([0, 3, 7, 10]));
      const colorMaj6 = ColorUtils.getChordColor(toNoteIndices([0, 4, 7, 9]));
      expect(colorMin7).toBe(colorMaj6);
    });
    it("color of Maj7 is distinguishable from +Maj7", () => {
      // [0, 4, 7, 11] (Maj7): cyclic intervals [1, 4, 3, 4]
      // [0, 4, 8, 11] (+Maj7, augmented major seventh): cyclic intervals [1, 4, 4, 3]
      const colorMaj7 = ColorUtils.getChordColor(toNoteIndices([0, 4, 7, 11]));
      const colorPlusMaj7 = ColorUtils.getChordColor(
        toNoteIndices([0, 4, 8, 11]),
      );
      expect(colorMaj7).not.toBe(colorPlusMaj7);
    });
  });
});
