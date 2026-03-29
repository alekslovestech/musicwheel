import { ChordType } from "@/types/enums/ChordType";

import { MusicalKey } from "@/types/Keys/MusicalKey";
import { RomanResolver } from "@/utils/resolvers/RomanResolver";
import { NoteConverter } from "@/utils/NoteConverter";
import { GreekTestConstants } from "../utils/GreekTestConstants";

function verifyResolvedChord(
  musicalKey: MusicalKey,
  romanNumeral: string,
  noteName: string,
  chordType: ChordType
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
            testCase.type
          );
        });
      });
    });
  });
});
