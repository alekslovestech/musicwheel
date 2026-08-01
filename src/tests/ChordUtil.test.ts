import { AbsoluteChord } from "@/types/AbsoluteChord";
import { ChordType } from "@/types/enums/ChordType";
import { InversionIndex, ixActual, toNoteIndices, ixInversion } from "@/types/IndexTypes";
import { NoteConverter } from "@/utils/NoteConverter";
import { KeyType } from "@/types/enums/KeyType";
import { DEFAULT_MUSICAL_KEY } from "@/types/Keys/MusicalKey";

import { MusicalKey } from "@/types/Keys/MusicalKey";

import { ChordDisplayMode } from "@/types/enums/SettingModes";
import { ChordUtils } from "@/utils/ChordUtils";
import { MusicalDisplayFormatter } from "@/utils/formatters/MusicalDisplayFormatter";
import { makeChordReference } from "@/types/interfaces/ChordReference";

function verifyChordNameWithMode(
  expectedChordName: string,
  indices: number[],
  displayMode: ChordDisplayMode = ChordDisplayMode.Letters,
  musicalKey: MusicalKey = DEFAULT_MUSICAL_KEY,
) {
  const actualIndices = toNoteIndices(indices);
  const chordRef = MusicalDisplayFormatter.getChordReferenceFromIndices(actualIndices);

  // For inversions, pass the bass note (lowest note) to the derivation function
  const bassNote = actualIndices.length > 0 ? Math.min(...actualIndices) : undefined;

  const actual = chordRef
    ? MusicalDisplayFormatter.deriveChordNameFromReference(
        chordRef,
        displayMode,
        musicalKey,
        ixActual(bassNote ?? 0),
      )
    : "";

  expect(actual).toBe(expectedChordName);
}

// The other helper functions remain unchanged since they test ChordUtils directly
function verifyChordNotesFromIndex(
  expectedNotes: number[],
  index: number,
  chordType: ChordType,
  inversion: InversionIndex = ixInversion(0),
) {
  const chordRef = makeChordReference(ixActual(index), chordType, inversion);
  const result = ChordUtils.calculateChordNotesFromChordReference(chordRef);
  expect(result).toEqual(expectedNotes);
}

function verifyOffsetsFromIdAndInversion(
  expectedOffsets: number[],
  id: ChordType,
  inversionIndex: InversionIndex = ixInversion(0),
) {
  const result = ChordUtils.getOffsetsFromIdAndInversion(id, inversionIndex);
  expect(result).toEqual(expectedOffsets);
}

describe("ChordUtils", () => {
  describe("deriveChordName", () => {
    const testCases = [
      { expected: "Ø", indices: [] },
      { expected: "M3", indices: [0, 4] },
      { expected: "C", indices: [0, 4, 7] },
      { expected: "C/E", indices: [4, 7, 12] },
      { expected: "C/G", indices: [7, 12, 16] },
      { expected: "Dm", indices: [2, 5, 9] },
      { expected: "Dm/F", indices: [5, 9, 14] },
      { expected: "E", indices: [4] },
      {
        expected: "Edim",
        indices: [4, 7, 10],
        mode: ChordDisplayMode.Letters,
      },
      { expected: "E°", indices: [4, 7, 10], mode: ChordDisplayMode.Symbols },
      {
        expected: "D♭",
        indices: [1, 5, 8],
        mode: ChordDisplayMode.Letters,
        key: MusicalKey.fromClassicalMode("Db", KeyType.Major),
      },
      {
        expected: "C7",
        indices: [0, 4, 7, 10],
        mode: ChordDisplayMode.Letters,
      },
      {
        expected: "C7",
        indices: [0, 4, 7, 10],
        mode: ChordDisplayMode.Symbols,
      },
      { expected: "Csus4", indices: [0, 5, 7] },
      { expected: "C(?)", indices: [0, 1, 2] },
      { expected: "Csus24", indices: [0, 2, 5] },
      { expected: "Cm4", indices: [0, 3, 5] },
      { expected: "C34", indices: [0, 4, 5] },
      { expected: "Csus2♯4", indices: [0, 2, 6] },
      { expected: "C♭5", indices: [0, 4, 6] },
      { expected: "C7♭5", indices: [0, 4, 6, 10] },
      // D-F#-Ab-C
      { expected: "D7♭5", indices: [2, 6, 8, 12] },
    ];

    testCases.forEach(({ expected, indices, mode, key }) => {
      it(`should return "${expected}" for given indices`, () => {
        verifyChordNameWithMode(expected, indices, mode, key);
      });
    });
  });

  describe("getOffsetsFromIdAndInversion", () => {
    const testCases = [
      { expected: [0, 4, 7], type: ChordType.Major },
      { expected: [0, 3, 7], type: ChordType.Minor },
      { expected: [0, 4, 7, 10], type: ChordType.Dominant7 },
      { expected: [0, 4, 6, 10], type: ChordType.Dominant7Flat5 },
      { expected: [0, 4, 7, 11], type: ChordType.Major7 },
      { expected: [0, 3, 7, 10], type: ChordType.Minor7 },
      { expected: [0, 3, 6], type: ChordType.Diminished },
      { expected: [0, 4, 8], type: ChordType.Augmented },
      { expected: [0, 5, 7], type: ChordType.Sus4 },
      {
        expected: [-8, -5, 0],
        type: ChordType.Major,
        inversion: ixInversion(1),
      },
      {
        expected: [-5, 0, 4],
        type: ChordType.Major,
        inversion: ixInversion(2),
      },
      {
        expected: [-9, -5, 0],
        type: ChordType.Minor,
        inversion: ixInversion(1),
      },
      {
        expected: [-5, -2, 0, 4],
        type: ChordType.Dominant7,
        inversion: ixInversion(2),
      },
      {
        expected: [-1, 0, 4, 7],
        type: ChordType.Major7,
        inversion: ixInversion(3),
      },
    ];

    testCases.forEach(({ expected, type, inversion }) => {
      it(`should handle ${type}${inversion ? ` inversion ${inversion}` : ""}`, () => {
        verifyOffsetsFromIdAndInversion(expected, type, inversion);
      });
    });
  });

  describe("calculateChordNotesFromIndex", () => {
    const testCases = [
      { expected: [0, 4, 7], index: 0, type: ChordType.Major },
      { expected: [0, 3, 7], index: 0, type: ChordType.Minor },
      {
        expected: [4, 7, 12],
        index: 0,
        type: ChordType.Major,
        inversion: ixInversion(1),
      },
      {
        expected: [7, 10, 12, 16],
        index: 0,
        type: ChordType.Dominant7,
        inversion: ixInversion(2),
      },
      { expected: [10, 14, 17], index: 22, type: ChordType.Major },
      {
        expected: [3, 7, 12],
        index: 0,
        type: ChordType.Minor,
        inversion: ixInversion(1),
      },
      {
        expected: [7, 12, 15],
        index: 0,
        type: ChordType.Minor,
        inversion: ixInversion(2),
      },
      {
        expected: [10, 12, 16, 19],
        index: 0,
        type: ChordType.Dominant7,
        inversion: ixInversion(3),
      },
      { expected: [0, 4, 7, 10, 13], index: 0, type: ChordType.Seven13 },
      { expected: [0, 4, 7, 10, 13], index: 12, type: ChordType.Seven13 },
      { expected: [11, 15, 18, 21], index: 11, type: ChordType.Seven13 },
      { expected: [0, 4, 7, 14], index: 12, type: ChordType.Add9 },
      { expected: [11, 15, 18], index: 11, type: ChordType.Add9 },
      { expected: [0, 2, 4, 7], index: 0, type: ChordType.Add2 },
    ];

    testCases.forEach(({ expected, index, type, inversion }) => {
      it(`should calculate ${type}${
        inversion ? ` inversion ${inversion}` : ""
      } from index ${index}`, () => {
        verifyChordNotesFromIndex(expected, index, type, inversion);
      });
    });
  });

  describe("noteIndicesFromAbsoluteChord", () => {
    it("uses root position when bass equals root", () => {
      const chord = new AbsoluteChord("C", ChordType.Major);
      expect(ChordUtils.noteIndicesFromAbsoluteChord(chord, 0)).toEqual(toNoteIndices([0, 4, 7]));
    });

    it("uses inversion when bass differs (C major / G bass)", () => {
      const chord = new AbsoluteChord(
        NoteConverter.toChromaticIndex("C"),
        ChordType.Major,
        NoteConverter.toChromaticIndex("G"),
      );
      expect(ChordUtils.noteIndicesFromAbsoluteChord(chord, 0)).toEqual(toNoteIndices([7, 12, 16]));
    });
  });
});

describe("Dominant7Flat5 symmetry", () => {
  // 7♭5 contains two tritones a major third apart, so transposing the set by a
  // tritone maps it onto itself: D7♭5 and A♭7♭5 are the same four pitch classes.
  const D_F$_Ab_C = [2, 6, 8, 12];
  const Ab_C_D_F$ = [8, 12, 14, 18];

  const pitchClasses = (indices: number[]) => new Set(indices.map((i) => i % 12));

  it("is the same pitch-class set rooted a tritone apart", () => {
    expect(pitchClasses(D_F$_Ab_C)).toEqual(pitchClasses(Ab_C_D_F$));
  });

  it("names each voicing from its own bass note", () => {
    verifyChordNameWithMode("D7♭5", D_F$_Ab_C);
    // Same root, spelled G♯ rather than A♭ because the default key spells with sharps.
    verifyChordNameWithMode("G♯7♭5", Ab_C_D_F$);
    verifyChordNameWithMode(
      "A♭7♭5",
      Ab_C_D_F$,
      ChordDisplayMode.Letters,
      MusicalKey.fromClassicalMode("Ab", KeyType.Major),
    );
  });

  it("resolves both voicings to the same chord type", () => {
    const typeOf = (indices: number[]) =>
      MusicalDisplayFormatter.getChordReferenceFromIndices(toNoteIndices(indices))?.id;

    expect(typeOf(D_F$_Ab_C)).toBe(ChordType.Dominant7Flat5);
    expect(typeOf(Ab_C_D_F$)).toBe(ChordType.Dominant7Flat5);
  });
});

describe("Major7Sus4 (Panthu Varaali diatonic bII7)", () => {
  it("names the Panthu Varaali bII7 chord from its own bass note", () => {
    // C Panthu Varaali (0,1,4,6,7,8,11), degree bII: C#-F#-Ab-C.
    verifyChordNameWithMode("C♯maj7sus4", [1, 6, 8, 12]);
  });

  it("has no 3rd: sus4 with a major 7th on top", () => {
    verifyOffsetsFromIdAndInversion([0, 5, 7, 11], ChordType.Major7Sus4);
  });
});

describe("Dominant7Sus2Flat5 (Panthu Varaali diatonic #IV7)", () => {
  it("names the Panthu Varaali #IV7 chord from its own bass note", () => {
    // C Panthu Varaali, degree #IV (root F#): F#-G#-C-E.
    verifyChordNameWithMode("F♯7sus2♭5", [6, 8, 12, 16]);
  });

  it("has no 3rd: sus2 dominant with a flat 5", () => {
    verifyOffsetsFromIdAndInversion([0, 2, 6, 10], ChordType.Dominant7Sus2Flat5);
  });
});

describe("Major7Flat5 (Panthu Varaali diatonic V7)", () => {
  it("names the Panthu Varaali V7 chord from its own bass note", () => {
    // C Panthu Varaali, degree V (root G): G-B-C#-F#.
    verifyChordNameWithMode("Gmaj7♭5", [7, 11, 13, 18]);
  });

  it("is the major-quality counterpart to HalfDiminished (m7♭5)", () => {
    verifyOffsetsFromIdAndInversion([0, 4, 6, 11], ChordType.Major7Flat5);
  });
});

describe("Sus2Add6 (Panthu Varaali diatonic VII7)", () => {
  it("names the Panthu Varaali VII7 chord from its own bass note", () => {
    // C Panthu Varaali, degree VII (root B): B-C#-F#-G#.
    verifyChordNameWithMode("B6sus2", [11, 13, 18, 20]);
  });

  it("has no 3rd and no 7th: sus2 with an added 6th", () => {
    verifyOffsetsFromIdAndInversion([0, 2, 7, 9], ChordType.Sus2Add6);
  });
});
