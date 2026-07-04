import { AccidentalType } from "@/types/enums/AccidentalType";
import { ChordType } from "@/types/enums/ChordType";
import { KeyType } from "@/types/enums/KeyType";
import { ScaleModeType } from "@/types/enums/ScaleModeType";
import { ScalePlaybackMode } from "@/types/enums/ScalePlaybackMode";
import { createNoteWithOctave } from "@/types/interfaces/NoteWithOctave";
import { makeChordReference } from "@/types/interfaces/ChordReference";
import { toNoteIndices } from "@/types/IndexTypes";
import { MusicalKey } from "@/types/Keys/MusicalKey";
import { ixScaleDegree, scaleDegreeToIndex } from "@/types/ScaleModes/ScaleDegreeType";

import { SpellingUtils } from "@/utils/SpellingUtils";
import { MusicalDisplayFormatter } from "@/utils/formatters/MusicalDisplayFormatter";
import { ChordProgressionResolver } from "@/utils/resolvers/ChordProgressionResolver";
import { RomanResolver } from "@/utils/resolvers/RomanResolver";
import { getScaleStepAtDegree } from "@/utils/SequencePlaybackUtils";
import { SpellingKind } from "@/utils/spelling/SpellingContext";
import { SpellingTestUtils } from "@/tests/utils/SpellingTestUtils";

describe("SpellingStaff - StaffRenderer spelling integration", () => {
  test("Ukrainian Dorian ii triad in C minor spells F#, not Gb (scale triad playback)", () => {
    const key = MusicalKey.fromGreekMode("C", ScaleModeType.UkrainianDorian);
    const step = getScaleStepAtDegree(
      key,
      scaleDegreeToIndex(ixScaleDegree(2)),
      ScalePlaybackMode.Triad,
    );

    const result = SpellingUtils.computeNotesForStaff(
      step.notesToPlay!,
      key.getStaffSpellingKey(),
      { kind: SpellingKind.ChordPreset, chordRef: step.chordRef! },
    );

    SpellingTestUtils.verifyNoteWithOctaveArray(result, [
      createNoteWithOctave("D", AccidentalType.None),
      createNoteWithOctave("F", AccidentalType.Sharp),
      createNoteWithOctave("A", AccidentalType.None),
    ]);
  });

  test("C double harmonic major V triad spells Db, not C# (MajFlat5 scale triad playback)", () => {
    const key = MusicalKey.fromGreekMode("C", ScaleModeType.DoubleHarmonicMajor);
    const step = getScaleStepAtDegree(
      key,
      scaleDegreeToIndex(ixScaleDegree(5)),
      ScalePlaybackMode.Triad,
    );

    expect(step.chordRef?.id).toBe(ChordType.MajFlat5);

    const result = SpellingUtils.computeNotesForStaff(
      step.notesToPlay!,
      key.getStaffSpellingKey(),
      { kind: SpellingKind.ChordPreset, chordRef: step.chordRef! },
    );

    SpellingTestUtils.verifyNoteWithOctaveArray(result, [
      createNoteWithOctave("G", AccidentalType.None),
      createNoteWithOctave("B", AccidentalType.None),
      createNoteWithOctave("D", AccidentalType.Flat, 1),
    ]);
  });

  test("D major triad in C minor spells F#, not Gb (harmony chord preset)", () => {
    const cMinor = MusicalKey.fromClassicalMode("C", KeyType.Minor);
    const chordRef = makeChordReference(2, ChordType.Major, 0);
    const indices = toNoteIndices([2, 6, 9]); // D, F#, A

    const result = SpellingUtils.computeNotesForStaff(indices, cMinor.getCanonicalIonianKey(), {
      kind: SpellingKind.ChordPreset,
      chordRef,
    });

    SpellingTestUtils.verifyNoteWithOctaveArray(result, [
      createNoteWithOctave("D", AccidentalType.None),
      createNoteWithOctave("F", AccidentalType.Sharp),
      createNoteWithOctave("A", AccidentalType.Natural),
    ]);
  });

  test("E major (II) in D minor spells G#, not Ab (progression step spelling)", () => {
    const dMinor = MusicalKey.fromClassicalMode("D", KeyType.Minor);
    const roman = RomanResolver.createRomanChordFromString("II");
    const noteIndices = ChordProgressionResolver.computeProgressionOctaves([roman], dMinor)[0]!;
    const chordRef = MusicalDisplayFormatter.getChordReferenceFromIndices(noteIndices)!;

    const result = SpellingUtils.computeNotesForStaff(
      noteIndices,
      dMinor.getStaffSpellingKey(),
      { kind: SpellingKind.ChordPreset, chordRef },
    );

    SpellingTestUtils.verifyNoteWithOctaveArray(result, [
      createNoteWithOctave("E", AccidentalType.None),
      createNoteWithOctave("G", AccidentalType.Sharp),
      createNoteWithOctave("B", AccidentalType.Natural),
    ]);
  });

  test("C minor triad in C minor omits accidental on Eb (already in key signature)", () => {
    const cMinor = MusicalKey.fromClassicalMode("C", KeyType.Minor);
    const chordRef = makeChordReference(0, ChordType.Minor, 0);
    const indices = toNoteIndices([0, 3, 7]); // C, Eb, G

    const result = SpellingUtils.computeNotesForStaff(indices, cMinor.getCanonicalIonianKey(), {
      kind: SpellingKind.ChordPreset,
      chordRef,
    });

    SpellingTestUtils.verifyNoteWithOctaveArray(result, [
      createNoteWithOctave("C", AccidentalType.None),
      createNoteWithOctave("E", AccidentalType.None),
      createNoteWithOctave("G", AccidentalType.None),
    ]);
  });
});


