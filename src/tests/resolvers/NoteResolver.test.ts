import { AccidentalType } from "@/types/enums/AccidentalType";

import { DEFAULT_MUSICAL_KEY, MusicalKey } from "@/types/Keys/MusicalKey";
import { createNoteInfo, NoteInfo } from "@/types/interfaces/NoteInfo";
import { KeyType } from "@/types/enums/KeyType";
import { NoteConverter } from "@/utils/NoteConverter";
import { ChromaticNoteResolver } from "@/utils/resolvers/ChromaticNoteResolver";

function verifyResolvedNote(
  musicalKey: MusicalKey,
  noteText: string,
  expectedNote: NoteInfo
) {
  const chromaticIndex = NoteConverter.toChromaticIndex(noteText);
  const note = ChromaticNoteResolver.resolveNoteInKey(
    musicalKey,
    chromaticIndex
  );
  expect(note).toEqual(expectedNote);
}

describe("Note resolution in keys", () => {
  const testCases = [
    {
      desc: "C major: default is sharp based",
      key: DEFAULT_MUSICAL_KEY,
      cases: [
        { note: "D", expected: createNoteInfo("D", AccidentalType.None) },
        { note: "C#", expected: createNoteInfo("C", AccidentalType.Sharp) },
        { note: "Db", expected: createNoteInfo("C", AccidentalType.Sharp) },
      ],
    },
    {
      desc: "D major: F# is in the key signature, F is not",
      key: MusicalKey.fromClassicalMode("D", KeyType.Major),
      cases: [
        { note: "F#", expected: createNoteInfo("F", AccidentalType.None) },
        { note: "F", expected: createNoteInfo("F", AccidentalType.Natural) },
      ],
    },
    {
      desc: "D minor: Bb is in the key signature, B is not",
      key: MusicalKey.fromClassicalMode("D", KeyType.Minor),
      cases: [
        { note: "Bb", expected: createNoteInfo("B", AccidentalType.None) },
        { note: "B", expected: createNoteInfo("B", AccidentalType.Natural) },
      ],
    },
  ];

  testCases.forEach(({ desc, key, cases }) => {
    describe(desc, () => {
      cases.forEach(({ note, expected }) => {
        test(`${note} resolves to ${expected.noteName}${expected.accidental}`, () => {
          verifyResolvedNote(key, note, expected);
        });
      });
    });
  });
});
