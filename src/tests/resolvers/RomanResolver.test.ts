import { AccidentalType } from "@/types/enums/AccidentalType";
import { ChordType } from "@/types/enums/ChordType";
import { MusicalKey } from "@/types/Keys/MusicalKey";
import { RomanChord } from "@/types/RomanChord";
import { RomanResolver } from "@/utils/resolvers/RomanResolver";
import { NoteConverter } from "@/utils/NoteConverter";
import { GreekTestConstants } from "../utils/GreekTestConstants";

function verifyResolvedChord(
  musicalKey: MusicalKey,
  romanNumeral: string,
  noteName: string,
  chordType: ChordType,
) {
  const noteIndex = NoteConverter.toChromaticIndex(noteName);
  const absoluteChord = RomanResolver.resolveRomanChord(
    RomanResolver.createRomanChordFromString(romanNumeral),
    musicalKey,
  );
  expect(absoluteChord).toEqual({
    chromaticIndex: noteIndex,
    chordType: chordType,
  });
}

describe("createRomanChordFromString", () => {
  const testCases = [
    {
      desc: "Basic numeral",
      input: "I",
      expected: RomanChord.fromScaleDegree(1, ChordType.Major),
    },
    {
      desc: "Sharp accidental",
      input: "♯I",
      expected: RomanChord.fromScaleDegree(
        1,
        ChordType.Major,
        AccidentalType.Sharp,
      ),
    },
    {
      desc: "Flat accidental",
      input: "♭I",
      expected: RomanChord.fromScaleDegree(
        1,
        ChordType.Major,
        AccidentalType.Flat,
      ),
    },
    {
      desc: "Flat minor",
      input: "♭iii",
      expected: RomanChord.fromScaleDegree(
        3,
        ChordType.Minor,
        AccidentalType.Flat,
      ),
    },
    {
      desc: "Dominant 7",
      input: "I7",
      expected: RomanChord.fromScaleDegree(1, ChordType.Dominant7),
    },
    {
      desc: "Augmented",
      input: "I+",
      expected: RomanChord.fromScaleDegree(1, ChordType.Augmented),
    },
    {
      desc: "Major 7",
      input: "Imaj7",
      expected: RomanChord.fromScaleDegree(1, ChordType.Major7),
    },
    {
      desc: "Sharp with major 7",
      input: "♯Imaj7",
      expected: RomanChord.fromScaleDegree(
        1,
        ChordType.Major7,
        AccidentalType.Sharp,
      ),
    },
    {
      desc: "Major/major slash chord",
      input: "I/V",
      expected: RomanChord.fromScaleDegree(
        1,
        ChordType.Major,
        AccidentalType.None,
        5,
      ),
    },
    {
      desc: "Major/minor slash chord",
      input: "I/v",
      expected: RomanChord.fromScaleDegree(
        1,
        ChordType.Major,
        AccidentalType.None,
        5,
      ),
    },
    {
      desc: "Minor/major slash chord",
      input: "i/V",
      expected: RomanChord.fromScaleDegree(
        1,
        ChordType.Minor,
        AccidentalType.None,
        5,
      ),
    },
  ];

  testCases.forEach(({ desc, input, expected }) => {
    test(desc, () => {
      expect(RomanResolver.createRomanChordFromString(input)).toEqual(expected);
    });
  });

  test("Invalid slash chord throws error", () => {
    expect(() => RomanResolver.createRomanChordFromString("I/V/VII")).toThrow();
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
      ],
    },
    {
      desc: "E major chords",
      key: constants.E_MAJOR,
      cases: [
        { numeral: "I", note: "E", type: ChordType.Major },
        { numeral: "V", note: "B", type: ChordType.Major },
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
          );
        });
      });
    });
  });
});
