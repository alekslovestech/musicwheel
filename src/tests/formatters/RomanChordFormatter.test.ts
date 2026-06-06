import { AccidentalType } from "@/types/enums/AccidentalType";
import { ChordType } from "@/types/enums/ChordType";
import { ixScaleDegree } from "@/types/ScaleModes/ScaleDegreeType";
import { RomanChordFormatter } from "@/utils/formatters/RomanChordFormatter";
import { makeRomanChord } from "../utils/RomanTestUtils";

describe("RomanChordFormatter.formatRomanChord", () => {
  type TestCase = {
    name: string;
    scaleDegree: number;
    chordType: ChordType;
    expected: string;
    accidental?: AccidentalType;
    bassDegree?: number;
  };

  const triads: TestCase[] = [
    {
      name: "formats I major triad",
      scaleDegree: 1,
      chordType: ChordType.Major,
      expected: "I",
    },
    {
      name: "formats vi minor triad",
      scaleDegree: 6,
      chordType: ChordType.Minor,
      expected: "vi",
    },
    {
      name: "formats ♭VII major triad",
      scaleDegree: 7,
      chordType: ChordType.Major,
      expected: "♭VII",
      accidental: AccidentalType.Flat,
    },
    {
      name: "formats ii diminished triad",
      scaleDegree: 2,
      chordType: ChordType.Diminished,
      expected: "ii°",
    },
    {
      name: "formats I augmented triad",
      scaleDegree: 1,
      chordType: ChordType.Augmented,
      expected: "I+",
    },
  ];

  const tetrachords: TestCase[] = [
    {
      name: "formats I major 6th",
      scaleDegree: 1,
      chordType: ChordType.Major6,
      expected: "I6",
    },
    {
      name: "formats ii minor 6th",
      scaleDegree: 2,
      chordType: ChordType.Minor6,
      expected: "ii6",
    },
    {
      name: "formats I dominant 7th",
      scaleDegree: 1,
      chordType: ChordType.Dominant7,
      expected: "I7",
    },
    {
      name: "formats ii minor 7th",
      scaleDegree: 2,
      chordType: ChordType.Minor7,
      expected: "ii7",
    },
    {
      name: "formats I major 7th",
      scaleDegree: 1,
      chordType: ChordType.Major7,
      expected: "IΔ7",
    },
    {
      name: "formats vii half diminished 7th",
      scaleDegree: 7,
      chordType: ChordType.HalfDiminished,
      expected: "viiø7",
    },
    {
      name: "formats vii diminished 7th",
      scaleDegree: 7,
      chordType: ChordType.Diminished7,
      expected: "vii°7",
    },
  ];

  const suspensions: TestCase[] = [
    {
      name: "formats I sus4",
      scaleDegree: 1,
      chordType: ChordType.Sus4,
      expected: "Isus",
    },
    {
      name: "formats I sus2",
      scaleDegree: 1,
      chordType: ChordType.Sus2,
      expected: "Isus2",
    },
    {
      name: "formats IV sus4",
      scaleDegree: 4,
      chordType: ChordType.Sus4,
      expected: "IVsus",
    },
    {
      name: "formats V sus2",
      scaleDegree: 5,
      chordType: ChordType.Sus2,
      expected: "Vsus2",
    },
    {
      name: "formats ♭VII sus4",
      scaleDegree: 7,
      chordType: ChordType.Sus4,
      expected: "♭VIIsus",
      accidental: AccidentalType.Flat,
    },
    {
      name: "formats Isus/V (slash chord)",
      scaleDegree: 1,
      chordType: ChordType.Sus4,
      expected: "Isus/V",
      accidental: AccidentalType.None,
      bassDegree: 5,
    },
  ];

  const slashChords: TestCase[] = [
    {
      name: "formats I/V (slash chord, major triad over V)",
      scaleDegree: 1,
      chordType: ChordType.Major,
      expected: "I/V",
      accidental: AccidentalType.None,
      bassDegree: 5,
    },
    {
      name: "formats iii7/II (slash chord, minor7 over II)",
      scaleDegree: 3,
      chordType: ChordType.Minor7,
      expected: "iii7/II",
      accidental: AccidentalType.None,
      bassDegree: 2,
    },
  ];

  const allCases = [...triads, ...tetrachords, ...suspensions, ...slashChords];

  for (const { name, scaleDegree, chordType, expected, accidental, bassDegree } of allCases) {
    it(name, () => {
      const chord = makeRomanChord(
        scaleDegree,
        chordType,
        accidental ?? AccidentalType.None,
        bassDegree ? ixScaleDegree(bassDegree) : undefined,
      );
      const actual = RomanChordFormatter.formatRomanChord(chord);
      expect(actual).toBe(expected);
    });
  }
});
