import { AccidentalType } from "@/types/enums/AccidentalType";
import {
  createNoteWithOctave,
  NoteWithOctave,
} from "@/types/interfaces/NoteWithOctave";
import { toNoteIndices } from "@/types/IndexTypes";

import { SpellingUtils } from "@/utils/SpellingUtils";
import { MusicalDisplayFormatter } from "@/utils/formatters/MusicalDisplayFormatter";

import { SpellingTestUtils } from "@/tests/utils/SpellingTestUtils";

describe("SpellingChordPreset - Chord preset-based note spelling", () => {
  // Helper function to make tests cleaner
  function testChordSpelling(
    description: string,
    chordIndices: number[],
    expectedNotes: NoteWithOctave[]
  ) {
    test(description, () => {
      const indices = toNoteIndices(chordIndices);
      //const chordMatch = MusicalDisplayFormatter.getMatchFromIndices(indices);
      const chordRef =
        MusicalDisplayFormatter.getChordReferenceFromIndices(indices);
      const result = SpellingUtils.computeNotesFromChordPreset(
        indices,
        chordRef!
      );

      expect(result).toHaveLength(expectedNotes.length);
      SpellingTestUtils.verifyNoteWithOctaveArray(result, expectedNotes);
    });
  }

  describe("computeNotesFromChordPreset", () => {
    describe("intervals", () => {
      testChordSpelling(
        "G minor 3rd",
        [7, 10], // G, Bb
        [
          createNoteWithOctave("G", AccidentalType.None, 0),
          createNoteWithOctave("B", AccidentalType.Flat, 0),
        ]
      );

      testChordSpelling(
        "G# major 3rd",
        [8, 12], // Ab, C
        [
          createNoteWithOctave("A", AccidentalType.Flat, 0),
          createNoteWithOctave("C", AccidentalType.None, 1),
        ]
      );

      testChordSpelling(
        "F perfect 4th",
        [5, 10], // F, Bb
        [
          createNoteWithOctave("F", AccidentalType.None, 0),
          createNoteWithOctave("B", AccidentalType.Flat, 0),
        ]
      );
    });
    describe("Major triads", () => {
      testChordSpelling(
        "G major triad in root position",
        [7, 11, 14], // G, B, D
        [
          createNoteWithOctave("G", AccidentalType.None, 0),
          createNoteWithOctave("B", AccidentalType.None, 0),
          createNoteWithOctave("D", AccidentalType.None, 1),
        ]
      );

      testChordSpelling(
        "G major triad in first inversion",
        [11, 14, 19], // B, D, G
        [
          createNoteWithOctave("B", AccidentalType.None, 0),
          createNoteWithOctave("D", AccidentalType.None, 1),
          createNoteWithOctave("G", AccidentalType.None, 1),
        ]
      );
    });

    describe("Minor triads", () => {
      testChordSpelling(
        "G minor triad in root position",
        [7, 10, 14], // G, Bb, D
        [
          createNoteWithOctave("G", AccidentalType.None, 0),
          createNoteWithOctave("B", AccidentalType.Flat, 0),
          createNoteWithOctave("D", AccidentalType.None, 1),
        ]
      );

      testChordSpelling(
        "B minor triad in root position",
        [11, 14, 18], // B, D, F#
        [
          createNoteWithOctave("B", AccidentalType.None, 0),
          createNoteWithOctave("D", AccidentalType.None, 1),
          createNoteWithOctave("F", AccidentalType.Sharp, 1),
        ]
      );

      testChordSpelling(
        "Bb minor triad in root position",
        [10, 13, 17], // Bb, Db, F
        [
          createNoteWithOctave("B", AccidentalType.Flat, 0),
          createNoteWithOctave("D", AccidentalType.Flat, 1),
          createNoteWithOctave("F", AccidentalType.None, 1),
        ]
      );

      testChordSpelling(
        "C# minor triad in root position",
        [1, 4, 8], // C#, E, G#
        [
          createNoteWithOctave("C", AccidentalType.Sharp, 0),
          createNoteWithOctave("E", AccidentalType.None, 0),
          createNoteWithOctave("G", AccidentalType.Sharp, 0),
        ]
      );
    });

    describe("Diminished triads", () => {
      testChordSpelling(
        "D dim => flat",
        [2, 5, 8], // D, F, Ab
        [
          createNoteWithOctave("D", AccidentalType.None, 0),
          createNoteWithOctave("F", AccidentalType.None, 0),
          createNoteWithOctave("A", AccidentalType.Flat, 0),
        ]
      );

      testChordSpelling(
        "D#/Eb dim => sharp",
        [3, 6, 9], // D#, F#, A
        [
          createNoteWithOctave("D", AccidentalType.Sharp, 0),
          createNoteWithOctave("F", AccidentalType.Sharp, 0),
          createNoteWithOctave("A", AccidentalType.None, 0),
        ]
      );

      testChordSpelling(
        "E dim => flat",
        [4, 7, 10], // Eb, G, Bb
        [
          createNoteWithOctave("E", AccidentalType.None, 0),
          createNoteWithOctave("G", AccidentalType.None, 0),
          createNoteWithOctave("B", AccidentalType.Flat, 0),
        ]
      );
    });

    //not always clean, and sometimes a mix of sharps and flats is best
    //but for now we'll just use the preference
    describe("Augmented triads", () => {
      testChordSpelling(
        "C aug in root position",
        [0, 4, 8], // C, E, G#
        [
          createNoteWithOctave("C", AccidentalType.None, 0),
          createNoteWithOctave("E", AccidentalType.None, 0),
          createNoteWithOctave("G", AccidentalType.Sharp, 0),
        ]
      );
      testChordSpelling(
        "G# aug => Ab",
        [8, 12, 16], // Ab, C, E
        [
          createNoteWithOctave("A", AccidentalType.Flat, 0),
          createNoteWithOctave("C", AccidentalType.None, 1),
          createNoteWithOctave("E", AccidentalType.None, 1),
        ]
      );
    });

    describe("Altered triads", () => {
      testChordSpelling(
        "C maj b5 => Gb",
        [0, 4, 6], // C, E, G♭
        [
          createNoteWithOctave("C", AccidentalType.None, 0),
          createNoteWithOctave("E", AccidentalType.None, 0),
          createNoteWithOctave("G", AccidentalType.Flat, 0),
        ]
      );
    });
  });
});
