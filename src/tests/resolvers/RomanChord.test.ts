import { AccidentalType } from "@/types/enums/AccidentalType";
import { ChordType } from "@/types/enums/ChordType";

import { RomanChord } from "@/types/RomanChord";
import { RomanResolver } from "@/utils/resolvers/RomanResolver";

export function verifyRomanChord(numeral: string, expected: RomanChord) {
  expect(RomanResolver.createRomanChordFromString(numeral)).toEqual(expected);
}

describe("RomanNumeral chord tests", () => {
  const testCases = [
    {
      desc: "Basic major and minor chords",
      cases: [
        {
          numeral: "I",
          expected: RomanChord.fromScaleDegree(1, ChordType.Major),
        },
        {
          numeral: "IV",
          expected: RomanChord.fromScaleDegree(4, ChordType.Major),
        },
        {
          numeral: "vi",
          expected: RomanChord.fromScaleDegree(6, ChordType.Minor),
        },
        {
          numeral: "vii",
          expected: RomanChord.fromScaleDegree(7, ChordType.Minor),
        },
      ],
    },
    {
      desc: "Accidentals",
      cases: [
        {
          numeral: "♯I",
          expected: RomanChord.fromScaleDegree(
            1,
            ChordType.Major,
            AccidentalType.Sharp,
          ),
        },
        {
          numeral: "♭I",
          expected: RomanChord.fromScaleDegree(
            1,
            ChordType.Major,
            AccidentalType.Flat,
          ),
        },
        {
          numeral: "♭iii",
          expected: RomanChord.fromScaleDegree(
            3,
            ChordType.Minor,
            AccidentalType.Flat,
          ),
        },
        {
          numeral: "♯iii",
          expected: RomanChord.fromScaleDegree(
            3,
            ChordType.Minor,
            AccidentalType.Sharp,
          ),
        },
        {
          numeral: "♭VI",
          expected: RomanChord.fromScaleDegree(
            6,
            ChordType.Major,
            AccidentalType.Flat,
          ),
        },
      ],
    },
    {
      desc: "Chord suffixes",
      cases: [
        {
          numeral: "I7",
          expected: RomanChord.fromScaleDegree(1, ChordType.Dominant7),
        },
        {
          numeral: "I+",
          expected: RomanChord.fromScaleDegree(1, ChordType.Augmented),
        },
        {
          numeral: "Imaj7",
          expected: RomanChord.fromScaleDegree(1, ChordType.Major7),
        },
        {
          numeral: "viio",
          expected: RomanChord.fromScaleDegree(7, ChordType.Diminished),
        },
        {
          numeral: "viio7",
          expected: RomanChord.fromScaleDegree(7, ChordType.Diminished7),
        },
        {
          numeral: "IV7",
          expected: RomanChord.fromScaleDegree(4, ChordType.Dominant7),
        },
        {
          numeral: "vi7",
          expected: RomanChord.fromScaleDegree(6, ChordType.Minor7),
        },
        {
          numeral: "IVmaj7",
          expected: RomanChord.fromScaleDegree(4, ChordType.Major7),
        },
        {
          numeral: "viiø7",
          expected: RomanChord.fromScaleDegree(7, ChordType.HalfDiminished),
        },
      ],
    },
    {
      desc: "Invalid cases",
      invalidCases: [
        { numeral: "i+", error: "aug chord cannot be lowercase" },
        { numeral: "imaj7", error: "maj7 cannot be lowercase" },
        { numeral: "VIIo", error: "dim chord cannot be uppercase" },
        { numeral: "VIIo7", error: "dim7 chord cannot be uppercase" },
        { numeral: "VIIø7", error: "dim7 cannot be uppercase" },
      ],
    },
    {
      desc: "Combined features",
      cases: [
        {
          numeral: "♯Imaj7",
          expected: RomanChord.fromScaleDegree(
            1,
            ChordType.Major7,
            AccidentalType.Sharp,
          ),
        },
        {
          numeral: "I/V",
          expected: RomanChord.fromScaleDegree(
            1,
            ChordType.Major,
            AccidentalType.None,
            5,
          ),
        },
        {
          numeral: "I/v",
          expected: RomanChord.fromScaleDegree(
            1,
            ChordType.Major,
            AccidentalType.None,
            5,
          ),
        },
        {
          numeral: "i/V",
          expected: RomanChord.fromScaleDegree(
            1,
            ChordType.Minor,
            AccidentalType.None,
            5,
          ),
        },
      ],
    },
  ];

  testCases.forEach(({ desc, cases, invalidCases }) => {
    describe(desc, () => {
      if (cases) {
        cases.forEach(({ numeral, expected }) => {
          test(numeral, () => {
            verifyRomanChord(numeral, expected);
          });
        });
      }

      if (invalidCases) {
        invalidCases.forEach(({ numeral, error }) => {
          test(`${numeral} (${error})`, () => {
            expect(() =>
              RomanResolver.createRomanChordFromString(numeral),
            ).toThrow();
          });
        });
      }
    });
  });
});
