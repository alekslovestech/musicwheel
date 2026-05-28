import { ChordType } from "@/types/enums/ChordType";
import { makeChordReference } from "@/types/interfaces/ChordReference";
import { RomanChord } from "@/types/RomanChord";
import {
  activeChordHighlightStyle,
  groupingIdForActiveChord,
  highlightForActiveChord,
} from "@/utils/visual/ChordHighlightUtils";
import { chordActiveHighlightFor } from "@/utils/visual/NoteGroupingColorRegistry";

describe("ChordHighlightUtils", () => {
  describe("groupingIdForActiveChord", () => {
    it("prefers roman chord type over chord ref", () => {
      const roman = RomanChord.fromScaleDegree(1, ChordType.Dominant7);
      const ref = makeChordReference(0, ChordType.Major);
      expect(groupingIdForActiveChord(roman, ref)).toBe(ChordType.Dominant7);
    });

    it("falls back to chord ref id", () => {
      expect(groupingIdForActiveChord(undefined, makeChordReference(0, ChordType.Minor))).toBe(
        ChordType.Minor,
      );
    });

    it("returns Unknown when neither source is provided", () => {
      expect(groupingIdForActiveChord()).toBe(ChordType.Unknown);
    });
  });

  describe("highlightForActiveChord", () => {
    it("resolves id and returns active highlight fill", () => {
      const roman = RomanChord.fromScaleDegree(1, ChordType.Major);
      expect(highlightForActiveChord(roman)).toBe(chordActiveHighlightFor(ChordType.Major));
    });

    it("uses chord ref when roman is omitted", () => {
      expect(highlightForActiveChord(undefined, makeChordReference(0, ChordType.Minor))).toBe(
        chordActiveHighlightFor(ChordType.Minor),
      );
    });
  });

  describe("activeChordHighlightStyle", () => {
    it("returns a backgroundColor style object", () => {
      expect(activeChordHighlightStyle(ChordType.Major)).toEqual({
        backgroundColor: chordActiveHighlightFor(ChordType.Major),
      });
    });
  });
});
