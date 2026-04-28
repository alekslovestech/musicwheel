import { AccidentalType } from "@/types/enums/AccidentalType";

import { NoteConverter } from "@/utils/NoteConverter";
import { ixActual } from "@/types/IndexTypes";

describe("getNoteTextFromActualIndex", () => {
  const testCases = [
    { index: 0, accidental: AccidentalType.Sharp, expected: "C" },
    { index: 1, accidental: AccidentalType.Sharp, expected: "C♯" },
    { index: 1, accidental: AccidentalType.Flat, expected: "D♭" },
    { index: 12, accidental: AccidentalType.Sharp, expected: "C" },
    { index: 13, accidental: AccidentalType.Sharp, expected: "C♯" },
  ];

  testCases.forEach(({ index, accidental, expected }) => {
    test(`index ${index} with ${accidental} accidental returns ${expected}`, () => {
      expect(NoteConverter.getNoteTextFromActualIndex(ixActual(index), accidental)).toBe(expected);
    });
  });
});
