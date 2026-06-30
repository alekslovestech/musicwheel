import { NoteWithOctaveArray } from "@/types/interfaces/NoteWithOctave";

export class SpellingTestUtils {
  static verifyNoteWithOctaveArray(
    actual: NoteWithOctaveArray,
    expected: NoteWithOctaveArray,
  ): void {
    expect(actual).toHaveLength(expected.length);
    for (let i = 0; i < actual.length; i++) {
      expect(actual[i].noteName).toBe(expected[i].noteName);
      expect(actual[i].accidental).toBe(expected[i].accidental);
      expect(actual[i].octaveOffset).toBe(expected[i].octaveOffset);
    }
  }
}
