import { ChordType } from "@/types/enums/ChordType";
import { SpecialType } from "@/types/enums/SpecialType";
import { ixActual, ixInversion, toNoteIndices } from "@/types/IndexTypes";
import { makeChordReference } from "@/types/interfaces/ChordReference";
import { NoteGroupingLibrary } from "@/types/NoteGroupingLibrary";
import { expectDistinctColors, expectEqualColors } from "@/tests/utils/ColorTestUtils";
import { ChordUtils } from "@/utils/ChordUtils";
import { ColorUtils } from "@/utils/visual/ColorUtils";
import { INTERVAL_CLASS_COLORS } from "@/utils/visual/IntervalClassColors";
import {
  chordActiveHighlightFor,
  getColorForGrouping,
} from "@/utils/visual/NoteGroupingColorRegistry";

function catalogIds() {
  return NoteGroupingLibrary.getAllIds().filter(
    (id) => id !== SpecialType.None && id !== SpecialType.Note,
  );
}

describe("NoteGroupingColorRegistry", () => {
  describe("cache matches direct compute", () => {
    it("getColorForGrouping(id) equals getColorForIndices(canonical offsets) for each id", () => {
      for (const id of catalogIds()) {
        const { offsets } = NoteGroupingLibrary.getGroupingById(id);
        const direct = ColorUtils.getColorForIndices(
          toNoteIndices(offsets.map((offset) => offset as number)),
        );
        expectEqualColors(getColorForGrouping(id), direct);
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
          expectEqualColors(invColor, cached);
        }
      }
    });
  });

  describe("known equivalences", () => {
    it("color(sus2) = color(sus4)", () => {
      expectEqualColors(getColorForGrouping(ChordType.Sus2), getColorForGrouping(ChordType.Sus4));
    });

    it("color(ø7) = color(min6)", () => {
      expectEqualColors(
        getColorForGrouping(ChordType.HalfDiminished),
        getColorForGrouping(ChordType.Minor6),
      );
    });

    it("color(min7) = color(maj6)", () => {
      expectEqualColors(
        getColorForGrouping(ChordType.Minor7),
        getColorForGrouping(ChordType.Major6),
      );
    });
  });

  describe("getColorForGrouping", () => {
    it("returns the default color for unmapped ids", () => {
      expectEqualColors(getColorForGrouping(ChordType.Unknown), INTERVAL_CLASS_COLORS[0]);
    });

    it("returns the default color when id is omitted", () => {
      expectEqualColors(getColorForGrouping(), INTERVAL_CLASS_COLORS[0]);
    });
  });

  describe("chordActiveHighlightFor", () => {
    it("returns a semi-transparent highlight color", () => {
      const highlight = chordActiveHighlightFor(ChordType.Major);
      expectDistinctColors(highlight, getColorForGrouping(ChordType.Major));
      expect(highlight.alpha()).toBeLessThan(getColorForGrouping(ChordType.Major).alpha());
    });

    it("uses the default color when id is omitted", () => {
      expectEqualColors(chordActiveHighlightFor(), chordActiveHighlightFor(ChordType.Unknown));
    });
  });
});
