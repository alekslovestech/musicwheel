import { ChordType } from "@/types/enums/ChordType";
import { SpecialType } from "@/types/enums/SpecialType";
import { ixActual, ixInversion, toNoteIndices } from "@/types/IndexTypes";
import { makeChordReference } from "@/types/interfaces/ChordReference";
import { NoteGroupingLibrary } from "@/types/NoteGroupingLibrary";
import { ChordUtils } from "@/utils/ChordUtils";
import { ColorUtils } from "@/utils/visual/ColorUtils";
import {
  getAllGroupingColors,
  getColorForGrouping,
} from "@/utils/visual/NoteGroupingColorRegistry";

function catalogIds() {
  return NoteGroupingLibrary.getAllIds().filter(
    (id) => id !== SpecialType.None && id !== SpecialType.Note,
  );
}

describe("NoteGroupingColorRegistry", () => {
  describe("catalog coverage", () => {
    it("caches a color for every non-special NoteGroupingId", () => {
      const colors = getAllGroupingColors();
      for (const id of catalogIds()) {
        expect(colors.has(id)).toBe(true);
        expect(getColorForGrouping(id)).toMatch(/^rgb\(/);
      }
    });
  });

  describe("cache matches direct compute", () => {
    it("getColorForGrouping(id) equals getColorForIndices(canonical offsets) for each id", () => {
      for (const id of catalogIds()) {
        const { offsets } = NoteGroupingLibrary.getGroupingById(id);
        const direct = ColorUtils.getColorForIndices(
          toNoteIndices(offsets.map((offset) => offset as number)),
        );
        expect(getColorForGrouping(id)).toBe(direct);
      }
    });
  });

  describe("inversion invariance", () => {
    it("cached root-position color equals color from any inversion offsets", () => {
      for (const id of catalogIds()) {
        const grouping = NoteGroupingLibrary.getGroupingById(id);
        if (grouping.offsets.length <= 1) continue;

        const cached = getColorForGrouping(id);
        for (let i = 1; i < grouping.inversions.length; i++) {
          const chordRef = makeChordReference(ixActual(0), id, ixInversion(i));
          const invIndices = ChordUtils.calculateChordNotesFromChordReference(chordRef);
          const invColor = ColorUtils.getColorForIndices(invIndices);
          expect(invColor).toBe(cached);
        }
      }
    });
  });

  describe("known equivalences", () => {
    it("color(sus2) = color(sus4)", () => {
      expect(getColorForGrouping(ChordType.Sus2)).toBe(getColorForGrouping(ChordType.Sus4));
    });

    it("color(ø7) = color(min6)", () => {
      expect(getColorForGrouping(ChordType.HalfDiminished)).toBe(
        getColorForGrouping(ChordType.Minor6),
      );
    });

    it("color(min7) = color(maj6)", () => {
      expect(getColorForGrouping(ChordType.Minor7)).toBe(getColorForGrouping(ChordType.Major6));
    });
  });
});
