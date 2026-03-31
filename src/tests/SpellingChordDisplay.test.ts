import { toNoteIndices } from "@/types/IndexTypes";

import { MusicalDisplayFormatter } from "@/utils/formatters/MusicalDisplayFormatter";
import { ChordDisplayMode } from "@/types/SettingModes";
import { NoteGroupingLibrary } from "@/types/NoteGroupingLibrary";
import {
  ChordReference,
  makeChordReference,
} from "@/types/interfaces/ChordReference";
import { ChordType } from "@/types/enums/ChordType";

describe("SpellingChordDisplay - Chord display info", () => {
  // Helper function to make tests cleaner
  function testChordDisplayInfo(
    description: string,
    chordIndices: number[],
    expectedChordName: string
  ) {
    test(description, () => {
      const indices = toNoteIndices(chordIndices);
      const chordRef =
        MusicalDisplayFormatter.getChordReferenceFromIndices(indices);
      const result = MusicalDisplayFormatter.getChordPresetDisplayInfo(
        indices,
        chordRef!,
        ChordDisplayMode.Symbols
      );

      expect(result.chordName).toBe(expectedChordName);
    });
  }

  function testChordDisplayInfoFromChordReference(
    description: string,
    chordRef: ChordReference,
    expectedChordName: string
  ) {
    test(description, () => {
      const definition = NoteGroupingLibrary.getGroupingById(chordRef.id);
      const indices = definition
        ? toNoteIndices(
            definition.offsets.map((offset) => chordRef.rootNote + offset)
          )
        : [];
      const result = MusicalDisplayFormatter.getChordPresetDisplayInfo(
        indices,
        chordRef!,
        ChordDisplayMode.Symbols
      );

      expect(result.chordName).toBe(expectedChordName);
    });
  }

  describe("computeNotesFromChordPreset", () => {
    describe("Minor 3rds", () => {
      testChordDisplayInfo(
        "G minor 3rd",
        [7, 10], // G, Bb
        "m3"
      );
    });
    describe("Major triads", () => {
      testChordDisplayInfo(
        "G major triad in root position",
        [7, 11, 14], // G, B, D
        "G"
      );

      testChordDisplayInfo(
        "G major triad in first inversion",
        [11, 14, 19], // B, D, G
        "G/B"
      );

      testChordDisplayInfo(
        "G major triad in second inversion",
        [2, 7, 11], // D, G, B
        "G/D"
      );
    });

    describe("Minor triads", () => {
      testChordDisplayInfo(
        "G minor triad in root position",
        [7, 10, 14], // G, Bb, D
        "Gm"
      );

      testChordDisplayInfo(
        "B minor triad in root position",
        [11, 14, 18], // B, D, F#
        "Bm"
      );

      testChordDisplayInfo(
        "Bb minor triad in root position",
        [10, 13, 17], // Bb, Db, F
        "B♭m"
      );

      testChordDisplayInfo(
        "C# minor triad in root position",
        [1, 4, 8], // C#, E, G#
        "C♯m"
      );
    });
  });

  //but for now we'll just use the preference
  describe("Augmented triads", () => {
    testChordDisplayInfo(
      "C aug in root position",
      [0, 4, 8], // C, E, G#
      "C+"
    );
    testChordDisplayInfo(
      "G# aug => Ab",
      [8, 12, 16], // Ab, C, E
      "A♭+"
    );
  });

  describe("Major triads from chord reference", () => {
    testChordDisplayInfoFromChordReference(
      "G major triad in root position",
      makeChordReference(7, ChordType.Major, 0),
      "G"
    );

    testChordDisplayInfoFromChordReference(
      "G major triad in first inversion",
      makeChordReference(7, ChordType.Major, 1),
      "G/B"
    );

    testChordDisplayInfoFromChordReference(
      "G major triad in second inversion",
      makeChordReference(7, ChordType.Major, 2),
      "G/D"
    );
  });
});
