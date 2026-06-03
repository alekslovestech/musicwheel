import { ChordType } from "@/types/enums/ChordType";

import { ChordProgression } from "@/types/ChordProgressions/ChordProgression";
import { ChordProgressionLibrary } from "@/types/ChordProgressions/ChordProgressionLibrary";
import { ChordProgressionType } from "@/types/enums/ChordProgressionType";
import { DEFAULT_MUSICAL_KEY, MusicalKey } from "@/types/Keys/MusicalKey";
import { AbsoluteChord } from "@/types/AbsoluteChord";
import { KeyType } from "@/types/enums/KeyType";
import { RomanResolver } from "@/utils/resolvers/RomanResolver";
import { NoteConverter } from "@/utils/NoteConverter";

describe("Chord progression derives correct chords for C major key", () => {
  const cMajor = DEFAULT_MUSICAL_KEY;
  const dMajor = MusicalKey.fromClassicalMode("D", KeyType.Major);
  const fMajor = MusicalKey.fromClassicalMode("F", KeyType.Major);
  const gMajor = MusicalKey.fromClassicalMode("G", KeyType.Major);
  const aMajor = MusicalKey.fromClassicalMode("A", KeyType.Major);
  const aMinor = MusicalKey.fromClassicalMode("A", KeyType.Minor);

  const testCases = [
    {
      desc: "50s progression for C major",
      progression: new ChordProgression(["I", "vi", "IV", "V"], "50s progression"),
      key: cMajor,
      expected: [
        new AbsoluteChord("C", ChordType.Major),
        new AbsoluteChord("A", ChordType.Minor),
        new AbsoluteChord("F", ChordType.Major),
        new AbsoluteChord("G", ChordType.Major),
      ],
    },
    {
      desc: "Something progression for C major",
      progression: new ChordProgression(["I", "Imaj7", "I7", "IV"], "Something"),
      key: cMajor,
      expected: [
        new AbsoluteChord("C", ChordType.Major),
        new AbsoluteChord("C", ChordType.Major7),
        new AbsoluteChord("C", ChordType.Dominant7),
        new AbsoluteChord("F", ChordType.Major),
      ],
    },
    {
      desc: "Something progression for F major",
      progression: new ChordProgression(["I", "Imaj7", "I7", "IV"], "Something"),
      key: fMajor,
      expected: [
        new AbsoluteChord("F", ChordType.Major),
        new AbsoluteChord("F", ChordType.Major7),
        new AbsoluteChord("F", ChordType.Dominant7),
        new AbsoluteChord("Bb", ChordType.Major),
      ],
    },
    {
      desc: "Simple progression for C major",
      progression: new ChordProgression(["I", "IV", "V", "IV"], "Sample"),
      key: cMajor,
      expected: [
        new AbsoluteChord("C", ChordType.Major),
        new AbsoluteChord("F", ChordType.Major),
        new AbsoluteChord("G", ChordType.Major),
        new AbsoluteChord("F", ChordType.Major),
      ],
    },
    {
      desc: "Simple progression for A major",
      progression: new ChordProgression(["I", "IV", "V", "IV"], "Sample"),
      key: aMajor,
      expected: [
        new AbsoluteChord("A", ChordType.Major),
        new AbsoluteChord("D", ChordType.Major),
        new AbsoluteChord("E", ChordType.Major),
        new AbsoluteChord("D", ChordType.Major),
      ],
    },
    {
      desc: "Creep progression for G major",
      progression: new ChordProgression(["I", "III", "IV", "iv"], "Creep"),
      key: gMajor,
      expected: [
        new AbsoluteChord("G", ChordType.Major),
        new AbsoluteChord("B", ChordType.Major),
        new AbsoluteChord("C", ChordType.Major),
        new AbsoluteChord("C", ChordType.Minor),
      ],
    },
    {
      desc: "Let it be: progression for C major",
      progression: new ChordProgression(["I", "V", "vi", "IV"], "Axis of Awesome"),
      key: cMajor,
      expected: [
        new AbsoluteChord("C", ChordType.Major),
        new AbsoluteChord("G", ChordType.Major),
        new AbsoluteChord("A", ChordType.Minor),
        new AbsoluteChord("F", ChordType.Major),
      ],
    },
    {
      desc: "With or without you: Axis of Awesome progression for D major",
      progression: new ChordProgression(["I", "V", "vi", "IV"], "Axis of Awesome"),
      key: dMajor,
      expected: [
        new AbsoluteChord("D", ChordType.Major),
        new AbsoluteChord("A", ChordType.Major),
        new AbsoluteChord("B", ChordType.Minor),
        new AbsoluteChord("G", ChordType.Major),
      ],
    },
    {
      desc: "I → ♭VI → IV → I",
      progression: new ChordProgression(["I", "♭VI", "IV", "I"], "Black Hole Sun"),
      key: gMajor,
      expected: [
        new AbsoluteChord("G", ChordType.Major),
        new AbsoluteChord("Eb", ChordType.Major),
        new AbsoluteChord("C", ChordType.Major),
        new AbsoluteChord("G", ChordType.Major),
      ],
    },
    {
      desc: "Andalusian cadence for A minor",
      progression: new ChordProgression(["i", "VII", "VI", "V"], "Andalusian Cadence"),
      key: aMinor,
      expected: [
        new AbsoluteChord("A", ChordType.Minor),
        new AbsoluteChord("G", ChordType.Major),
        new AbsoluteChord("F", ChordType.Major),
        new AbsoluteChord("E", ChordType.Major),
      ],
    },
    {
      desc: "Michelle progression for F minor",
      progression: new ChordProgression(["i", "III/VII", "♭viiø7", "VImaj7", "Vmaj7"], "Michelle"),
      key: MusicalKey.fromClassicalMode("F", KeyType.Minor),
      expected: [
        new AbsoluteChord("F", ChordType.Minor),
        new AbsoluteChord("Ab", ChordType.Major, NoteConverter.toChromaticIndex("Eb")),
        new AbsoluteChord("D", ChordType.HalfDiminished),
        new AbsoluteChord("Db", ChordType.Major7),
        new AbsoluteChord("C", ChordType.Major7),
      ],
    },
    {
      desc: "Bohemian Rhapsody (Mama) for Eb major",
      progression: new ChordProgression(["I", "V/VII", "vi", "ii"], "Bohemian Rhapsody (Mama)"),
      key: MusicalKey.fromClassicalMode("Eb", KeyType.Major),
      expected: [
        new AbsoluteChord("Eb", ChordType.Major),
        new AbsoluteChord("Bb", ChordType.Major, NoteConverter.toChromaticIndex("D")),
        new AbsoluteChord("C", ChordType.Minor),
        new AbsoluteChord("F", ChordType.Minor),
      ],
    },
  ];

  testCases.forEach(({ desc, progression, key, expected }) => {
    it(desc, () => {
      const resolved = progression.progression.map(({ value }) =>
        RomanResolver.resolveRomanChord(value, key),
      );
      expect(resolved).toEqual(expected);
    });
  });
});

describe("ChordProgression suggestedMusicalKey default", () => {
  it("defaults to DEFAULT_MUSICAL_KEY when omitted", () => {
    const p = new ChordProgression(["I", "V"], "Test");
    expect(p.suggestedMusicalKey).toBe(DEFAULT_MUSICAL_KEY);
  });
});

describe("ChordProgressionLibrary", () => {
  it.each(Object.values(ChordProgressionType))(
    "%s tokens parse as a progression",
    (type) => {
      expect(() => ChordProgressionLibrary.getProgression(type)).not.toThrow();
    },
  );
});
