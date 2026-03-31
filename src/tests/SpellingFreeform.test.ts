import { AccidentalType } from "@/types/enums/AccidentalType";

import { DEFAULT_MUSICAL_KEY, MusicalKey } from "@/types/Keys/MusicalKey";
import { KeyType } from "@/types/enums/KeyType";
import { toNoteIndices } from "@/types/IndexTypes";

import { SpellingUtils } from "@/utils/SpellingUtils";
import { SpellingTestUtils } from "./utils/SpellingTestUtils";
import { createNoteWithOctave } from "@/types/interfaces/NoteWithOctave";
import { VexFlowFormatter } from "@/utils/formatters/VexFlowFormatter";

describe("SpellingFreeform - Key-based note spelling", () => {
  describe("computeNotesWithOctaves", () => {
    test("converts single note (white key) index to NoteWithOctave in C major", () => {
      const result = SpellingUtils.computeNotesFromMusicalKey(
        toNoteIndices([7]), // G note
        DEFAULT_MUSICAL_KEY
      );

      expect(result).toHaveLength(1);
      SpellingTestUtils.verifyNoteWithOctaveArray(result, [
        createNoteWithOctave("G", AccidentalType.None, 0),
      ]);
    });

    test("converts single note (black key) index to NoteWithOctave in C major", () => {
      const result = SpellingUtils.computeNotesFromMusicalKey(
        toNoteIndices([8]), // G# note
        DEFAULT_MUSICAL_KEY
      );

      expect(result).toHaveLength(1);
      SpellingTestUtils.verifyNoteWithOctaveArray(result, [
        createNoteWithOctave("G", AccidentalType.Sharp, 0),
      ]);
    });

    test("converts single note (black, next octave) index to NoteWithOctave in C major", () => {
      const result = SpellingUtils.computeNotesFromMusicalKey(
        toNoteIndices([13]), // C# note
        DEFAULT_MUSICAL_KEY
      );

      expect(result).toHaveLength(1);
      SpellingTestUtils.verifyNoteWithOctaveArray(result, [
        createNoteWithOctave("C", AccidentalType.Sharp, 1),
      ]);
    });

    test("converts multiple note indices to NoteWithOctaves in C major", () => {
      const result = SpellingUtils.computeNotesFromMusicalKey(
        toNoteIndices([7, 11, 14]), // G, B, D (G major triad)
        DEFAULT_MUSICAL_KEY
      );

      expect(result).toHaveLength(3);
      SpellingTestUtils.verifyNoteWithOctaveArray(result, [
        createNoteWithOctave("G", AccidentalType.None, 0),
        createNoteWithOctave("B", AccidentalType.None, 0),
        createNoteWithOctave("D", AccidentalType.None, 1),
      ]);
    });

    test("applies key signature correctly in D major", () => {
      const dMajor = MusicalKey.fromClassicalMode("D", KeyType.Major);
      const result = SpellingUtils.computeNotesFromMusicalKey(
        toNoteIndices([9, 13]), // A, C# in D major
        dMajor
      );

      expect(result).toHaveLength(2);
      SpellingTestUtils.verifyNoteWithOctaveArray(result, [
        createNoteWithOctave("A", AccidentalType.None, 0),
        createNoteWithOctave("C", AccidentalType.None, 1),
      ]);
    });

    test("returns empty array for empty input", () => {
      const result = SpellingUtils.computeNotesFromMusicalKey(
        toNoteIndices([]),
        DEFAULT_MUSICAL_KEY
      );

      expect(result).toEqual([]);
    });
  });

  describe("computeNotesFromChordPreset and computeNotesFromMusicalKey", () => {
    test("uses computeNotesFromMusicalKey for freeform notes", () => {
      const indices = toNoteIndices([7, 8]); // G, G#
      const result = SpellingUtils.computeNotesFromMusicalKey(
        indices,
        DEFAULT_MUSICAL_KEY
      );

      expect(result).toHaveLength(2);
      SpellingTestUtils.verifyNoteWithOctaveArray(result, [
        createNoteWithOctave("G", AccidentalType.None, 0),
        createNoteWithOctave("G", AccidentalType.Sharp, 0),
      ]);
    });

    test("uses computeNotesFromMusicalKey when not in chord mode", () => {
      const indices = toNoteIndices([7]); // G
      const result = SpellingUtils.computeNotesFromMusicalKey(
        indices,
        DEFAULT_MUSICAL_KEY
      );

      expect(result).toHaveLength(1);
      SpellingTestUtils.verifyNoteWithOctaveArray(result, [
        createNoteWithOctave("G", AccidentalType.None, 0),
      ]);
    });

    test("returns empty array for empty input", () => {
      const result = SpellingUtils.computeNotesFromMusicalKey(
        toNoteIndices([]),
        DEFAULT_MUSICAL_KEY
      );

      expect(result).toEqual([]);
    });
  });

  describe("VexFlow formatting", () => {
    test("NoteWithOctave formats correctly for VexFlow", () => {
      const result = SpellingUtils.computeNotesFromMusicalKey(
        toNoteIndices([7]), // G
        DEFAULT_MUSICAL_KEY
      );

      expect(VexFlowFormatter.formatNote(result[0])).toBe("G/4");
    });

    test("NoteWithOctave with accidental formats correctly", () => {
      const result = SpellingUtils.computeNotesFromMusicalKey(
        toNoteIndices([8]), // G#
        DEFAULT_MUSICAL_KEY
      );

      expect(VexFlowFormatter.formatNote(result[0])).toBe("G/4");
      expect(result[0].accidental).toBe(AccidentalType.Sharp);
    });
  });
});
