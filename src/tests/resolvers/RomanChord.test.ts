import { AccidentalType } from "@/types/enums/AccidentalType";
import { ChordType } from "@/types/enums/ChordType";
import { RomanChord } from "@/types/RomanChord";
import { RomanResolver } from "@/utils/resolvers/RomanResolver";
import { ixScaleDegree } from "@/types/ScaleModes/ScaleDegreeType";

import { makeRomanChord } from "../utils/RomanTestUtils";

export function verifyRomanChord(numeral: string, expected: RomanChord) {
  expect(RomanResolver.createRomanChordFromString(numeral)).toEqual(expected);
}

describe("RomanNumeral chord tests", () => {
  const validGroups = [
    {
      desc: "Basic major and minor chords",
      cases: [
        {
          numeral: "I",
          expected: makeRomanChord(1, ChordType.Major),
        },
        {
          numeral: "IV",
          expected: makeRomanChord(4, ChordType.Major),
        },
        {
          numeral: "vi",
          expected: makeRomanChord(6, ChordType.Minor),
        },
        {
          numeral: "vii",
          expected: makeRomanChord(7, ChordType.Minor),
        },
      ],
    },
    {
      desc: "Accidentals",
      cases: [
        {
          numeral: "♯I",
          expected: makeRomanChord(1, ChordType.Major, AccidentalType.Sharp),
        },
        {
          numeral: "♭I",
          expected: makeRomanChord(1, ChordType.Major, AccidentalType.Flat),
        },
        {
          numeral: "♭iii",
          expected: makeRomanChord(3, ChordType.Minor, AccidentalType.Flat),
        },
        {
          numeral: "♯iii",
          expected: makeRomanChord(3, ChordType.Minor, AccidentalType.Sharp),
        },
        {
          numeral: "♭VI",
          expected: makeRomanChord(6, ChordType.Major, AccidentalType.Flat),
        },
      ],
    },
    {
      desc: "Chord suffixes",
      cases: [
        {
          numeral: "I7",
          expected: makeRomanChord(1, ChordType.Dominant7),
        },
        {
          numeral: "I+",
          expected: makeRomanChord(1, ChordType.Augmented),
        },
        {
          numeral: "Imaj7",
          expected: makeRomanChord(1, ChordType.Major7),
        },
        {
          numeral: "viio",
          expected: makeRomanChord(7, ChordType.Diminished),
        },
        {
          numeral: "viio7",
          expected: makeRomanChord(7, ChordType.Diminished7),
        },
        {
          numeral: "iidim7",
          expected: makeRomanChord(2, ChordType.Diminished7),
        },
        {
          numeral: "IV7",
          expected: makeRomanChord(4, ChordType.Dominant7),
        },
        {
          numeral: "vi7",
          expected: makeRomanChord(6, ChordType.Minor7),
        },
        {
          numeral: "IVmaj7",
          expected: makeRomanChord(4, ChordType.Major7),
        },
        {
          numeral: "viiø7",
          expected: makeRomanChord(7, ChordType.HalfDiminished),
        },
      ],
    },
    {
      desc: "Combined features",
      cases: [
        {
          numeral: "♯Imaj7",
          expected: makeRomanChord(1, ChordType.Major7, AccidentalType.Sharp),
        },
        {
          numeral: "I/V",
          expected: makeRomanChord(1, ChordType.Major, AccidentalType.None, ixScaleDegree(5)),
        },
        {
          numeral: "I/v",
          expected: makeRomanChord(1, ChordType.Major, AccidentalType.None, ixScaleDegree(5)),
        },
        {
          numeral: "i/V",
          expected: makeRomanChord(1, ChordType.Minor, AccidentalType.None, ixScaleDegree(5)),
        },
      ],
    },
  ];

  const invalidGroup = {
    desc: "Invalid cases",
    cases: [
      { numeral: "i+", error: "aug chord cannot be lowercase" },
      { numeral: "imaj7", error: "maj7 cannot be lowercase" },
      { numeral: "VIIo", error: "dim chord cannot be uppercase" },
      { numeral: "VIIo7", error: "dim7 chord cannot be uppercase" },
      { numeral: "VIIø7", error: "dim7 cannot be uppercase" },
      { numeral: "I/V/VII", error: "invalid slash chord" },
    ],
  };

  validGroups.forEach((group) => {
    describe(group.desc, () => {
      group.cases.forEach(({ numeral, expected }) => {
        test(numeral, () => {
          verifyRomanChord(numeral, expected);
        });
      });
    });
  });

  describe(invalidGroup.desc, () => {
    invalidGroup.cases.forEach(({ numeral, error }) => {
      test(`${numeral} (${error})`, () => {
        expect(() => RomanResolver.createRomanChordFromString(numeral)).toThrow();
      });
    });
  });
});
