import { AccidentalType } from "@/types/enums/AccidentalType";
import { ChordType } from "@/types/enums/ChordType";
import { ChordProgressionLibrary } from "@/types/ChordProgressions/ChordProgressionLibrary";
import { ChordProgressionType } from "@/types/enums/ChordProgressionType";
import { MusicalKey } from "@/types/Keys/MusicalKey";
import { RomanChord } from "@/types/RomanChord";
import { RomanResolver } from "@/utils/resolvers/RomanResolver";
import { NoteConverter } from "@/utils/NoteConverter";
import { makeDurated, type NoteLength } from "@/types/Durated";
import { GreekTestConstants } from "../utils/GreekTestConstants";

// Local helper to shorten creation of durated RomanChords in test cases:
function duratedRoman(
  degree: number,
  type: ChordType,
  accidental: AccidentalType = AccidentalType.None,
  bass?: number,
  noteLength?: NoteLength,
  rhythmDots = 0,
) {
  return makeDurated(
    RomanChord.fromScaleDegree(degree, type, accidental, bass),
    noteLength,
    rhythmDots,
  );
}

function verifyResolvedChord(
  musicalKey: MusicalKey,
  romanNumeral: string,
  noteName: string,
  chordType: ChordType,
  bassNoteName?: string,
) {
  const noteIndex = NoteConverter.toChromaticIndex(noteName);
  const bassIndex = NoteConverter.toChromaticIndex(bassNoteName ?? noteName);
  const absoluteChord = RomanResolver.resolveRomanChord(
    RomanResolver.createRomanChordFromString(romanNumeral),
    musicalKey,
  );
  expect(absoluteChord).toEqual({
    chromaticIndex: noteIndex,
    chordType: chordType,
    bassNote: bassIndex,
  });
}

describe("parseChordProgressionDuration", () => {
  const validCases = [
    {
      desc: "parses bare numeral with no duration suffix",
      input: "IV",
      expected: duratedRoman(4, ChordType.Major),
    },
    {
      desc: "parses IV:2 as degree IV with LilyPond denominator 2",
      input: "IV:2",
      expected: duratedRoman(4, ChordType.Major, AccidentalType.None, undefined, 2),
    },
    {
      desc: "parses chord suffix before duration (ii7:8)",
      input: "ii7:8",
      expected: duratedRoman(2, ChordType.Minor7, AccidentalType.None, undefined, 8),
    },
    {
      desc: "parses accidental and duration (♭III:4)",
      input: "♭III:4",
      expected: duratedRoman(3, ChordType.Major, AccidentalType.Flat, undefined, 4),
    },
    {
      desc: "parses slash chord with duration (I/v:2)",
      input: "I/v:2",
      expected: duratedRoman(1, ChordType.Major, AccidentalType.None, 5, 2),
    },
    {
      desc: "trims whitespace around token",
      input: "  V:1  ",
      expected: duratedRoman(5, ChordType.Major, AccidentalType.None, undefined, 1),
    },
  ];

  const throwCases = [
    {
      desc: "token without digits after colon is not split; invalid roman throws",
      input: "IV:half",
    },
    {
      desc: "unsupported note length denominator throws (IV:3)",
      input: "IV:3",
    },
    {
      desc: "unsupported note length denominator throws (IV:64)",
      input: "IV:64",
    },
    {
      desc: "invalid roman after stripping duration still throws",
      input: "I/V/VII:4",
    },
  ];

  validCases.forEach((testCase) => {
    test(testCase.desc, () => {
      expect(RomanResolver.parseRomanChordWithDuration(testCase.input)).toEqual(testCase.expected);
    });
  });

  throwCases.forEach((testCase) => {
    test(testCase.desc, () => {
      expect(() => RomanResolver.parseRomanChordWithDuration(testCase.input)).toThrow();
    });
  });
});

describe("Resolved roman numeral tests", () => {
  const constants = GreekTestConstants.getInstance();

  const testCases = [
    {
      desc: "C major chords",
      key: constants.C_IONIAN_KEY,
      cases: [
        { numeral: "I", note: "C", type: ChordType.Major },
        { numeral: "Imaj7", note: "C", type: ChordType.Major7 },
        { numeral: "V", note: "G", type: ChordType.Major },
        {
          numeral: "I/V",
          note: "C",
          type: ChordType.Major,
          bassNote: "G",
        },
      ],
    },
    {
      desc: "E major chords",
      key: constants.E_MAJOR,
      cases: [
        { numeral: "I", note: "E", type: ChordType.Major },
        { numeral: "V", note: "B", type: ChordType.Major },
        {
          numeral: "I/V",
          note: "E",
          type: ChordType.Major,
          bassNote: "B",
        },
      ],
    },
    {
      desc: "G major chords",
      key: constants.G_MAJOR,
      cases: [{ numeral: "♭VI", note: "Eb", type: ChordType.Major }],
    },
  ];

  testCases.forEach((group) => {
    describe(group.desc, () => {
      group.cases.forEach((testCase) => {
        test(`Resolve ${testCase.numeral}`, () => {
          verifyResolvedChord(
            group.key,
            testCase.numeral,
            testCase.note,
            testCase.type,
            "bassNote" in testCase ? testCase.bassNote : undefined,
          );
        });
      });
    });
  });
});

/**
 * Sixth chords, dominant seventh with duration, and LilyPond dotted denominators (`:4.`)
 * as used by {@link ChordProgressionType.Gypsy_Woman}.
 */
describe("planned progression notation (I6, I7, dotted LilyPond lengths)", () => {
  test("I6 is major sixth on scale degree I", () => {
    expect(RomanResolver.parseRomanChordWithDuration("I6")).toEqual(duratedRoman(1, ChordType.Six));
  });

  test("ii6 is minor sixth on scale degree II", () => {
    expect(RomanResolver.parseRomanChordWithDuration("ii6")).toEqual(
      duratedRoman(2, ChordType.Minor6),
    );
  });

  test("I7 is dominant seventh on scale degree I", () => {
    expect(RomanResolver.parseRomanChordWithDuration("I7")).toEqual(
      duratedRoman(1, ChordType.Dominant7),
    );
  });

  test("I7:4. keeps I7 harmony with dotted-quarter denominator (LilyPond :4.)", () => {
    expect(RomanResolver.parseRomanChordWithDuration("I7:4.")).toEqual(
      duratedRoman(1, ChordType.Dominant7, AccidentalType.None, undefined, 4, 1),
    );
  });

  test("I6:4. keeps I6 harmony with dotted-quarter denominator", () => {
    expect(RomanResolver.parseRomanChordWithDuration("I6:4.")).toEqual(
      duratedRoman(1, ChordType.Six, AccidentalType.None, undefined, 4, 1),
    );
  });

  test("ChordProgressionLibrary Gypsy Woman tokens parse as a progression", () => {
    expect(() =>
      ChordProgressionLibrary.getProgression(ChordProgressionType.Gypsy_Woman),
    ).not.toThrow();
  });
});
