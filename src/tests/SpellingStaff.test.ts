import { AccidentalType } from "@/types/enums/AccidentalType";
import { ChordType } from "@/types/enums/ChordType";
import { KeyType } from "@/types/enums/KeyType";
import { ScaleModeType } from "@/types/enums/ScaleModeType";
import { ScalePlaybackMode } from "@/types/ScalePlaybackMode";
import { createNoteWithOctave } from "@/types/interfaces/NoteWithOctave";
import { makeChordReference } from "@/types/interfaces/ChordReference";
import { toNoteIndices } from "@/types/IndexTypes";
import { MusicalKey } from "@/types/Keys/MusicalKey";

import { computeScalePlaybackStep } from "@/lib/sequencePlaybackHelpers";
import { SpellingUtils } from "@/utils/SpellingUtils";
import { SpellingTestUtils } from "@/tests/utils/SpellingTestUtils";

describe("SpellingStaff - StaffRenderer spelling integration", () => {
  test("Ukrainian Dorian ii triad in C minor spells F#, not Gb (scale triad playback)", () => {
    const key = MusicalKey.fromGreekMode("C", ScaleModeType.UkrainianDorian);
    const step = computeScalePlaybackStep(key, 1, ScalePlaybackMode.Triad);

    const result = SpellingUtils.computeNotesForStaff(
      step.notesToPlay!,
      key.getStaffSpellingKey(),
      step.chordRef,
    );

    SpellingTestUtils.verifyNoteWithOctaveArray(result, [
      createNoteWithOctave("D", AccidentalType.None),
      createNoteWithOctave("F", AccidentalType.Sharp),
      createNoteWithOctave("A", AccidentalType.None),
    ]);
  });

  test("D major triad in C minor spells F#, not Gb (harmony chord preset)", () => {
    const cMinor = MusicalKey.fromClassicalMode("C", KeyType.Minor);
    const chordRef = makeChordReference(2, ChordType.Major, 0);
    const indices = toNoteIndices([2, 6, 9]); // D, F#, A

    const result = SpellingUtils.computeNotesForStaff(
      indices,
      cMinor.getCanonicalIonianKey(),
      chordRef,
    );

    SpellingTestUtils.verifyNoteWithOctaveArray(result, [
      createNoteWithOctave("D", AccidentalType.None),
      createNoteWithOctave("F", AccidentalType.Sharp),
      createNoteWithOctave("A", AccidentalType.Natural),
    ]);
  });

  test("C minor triad in C minor omits accidental on Eb (already in key signature)", () => {
    const cMinor = MusicalKey.fromClassicalMode("C", KeyType.Minor);
    const chordRef = makeChordReference(0, ChordType.Minor, 0);
    const indices = toNoteIndices([0, 3, 7]); // C, Eb, G

    const result = SpellingUtils.computeNotesForStaff(
      indices,
      cMinor.getCanonicalIonianKey(),
      chordRef,
    );

    SpellingTestUtils.verifyNoteWithOctaveArray(result, [
      createNoteWithOctave("C", AccidentalType.None),
      createNoteWithOctave("E", AccidentalType.None),
      createNoteWithOctave("G", AccidentalType.None),
    ]);
  });
});
