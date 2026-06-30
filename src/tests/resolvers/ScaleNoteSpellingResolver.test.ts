import { AccidentalType } from "@/types/enums/AccidentalType";
import { ScaleModeType } from "@/types/enums/ScaleModeType";
import { createNoteInfo } from "@/types/interfaces/NoteInfo";
import { MusicalKey } from "@/types/Keys/MusicalKey";
import { NoteConverter } from "@/utils/NoteConverter";
import { ScaleNoteSpellingResolver } from "@/utils/resolvers/ScaleNoteSpellingResolver";
import { GreekTestConstants } from "@/tests/utils/GreekTestConstants";

describe("ScaleNoteSpellingResolver", () => {
  const constants = GreekTestConstants.getInstance();

  function verifyScaleNoteSpelling(musicalKey: MusicalKey, noteText: string, expected: string) {
    const chromaticIndex = NoteConverter.toChromaticIndex(noteText);
    const noteInfo = ScaleNoteSpellingResolver.resolveNoteInScale(musicalKey, chromaticIndex);
    expect(noteInfo).not.toBeNull();
    const display =
      noteInfo!.noteName +
      (noteInfo!.accidental === AccidentalType.Sharp
        ? "#"
        : noteInfo!.accidental === AccidentalType.Flat
          ? "b"
          : "");
    expect(display).toBe(NoteConverter.sanitizeNoteString(expected));
  }

  test("C Phrygian degree 2 spells Db, not C#", () => {
    verifyScaleNoteSpelling(constants.C_PHRYGIAN_KEY, "Db", "Db");
  });

  test("C Phrygian spells all scale degrees with expected letter names", () => {
    const expected = ["C", "Db", "Eb", "F", "G", "Ab", "Bb"];
    for (const noteText of expected) {
      verifyScaleNoteSpelling(constants.C_PHRYGIAN_KEY, noteText, noteText);
    }
  });

  test("C Lydian degree 4 spells F#, not Gb", () => {
    verifyScaleNoteSpelling(constants.C_LYDIAN_KEY, "F#", "F#");
  });

  test("A Phrygian degree 2 spells Bb, not A#", () => {
    const key = MusicalKey.fromGreekMode("A", ScaleModeType.Phrygian);
    verifyScaleNoteSpelling(key, "Bb", "Bb");
  });

  test("returns null for chromatic notes outside the scale", () => {
    const noteInfo = ScaleNoteSpellingResolver.resolveNoteInScale(
      constants.C_PHRYGIAN_KEY,
      NoteConverter.toChromaticIndex("D"),
    );
    expect(noteInfo).toBeNull();
  });

  test("degree 1 uses tonic spelling including accidentals", () => {
    const key = MusicalKey.fromGreekMode("F#", ScaleModeType.Phrygian);
    const noteInfo = ScaleNoteSpellingResolver.resolveNoteInScale(key, key.tonicIndex);
    expect(noteInfo).toEqual(createNoteInfo("F", AccidentalType.Sharp));
  });
});
