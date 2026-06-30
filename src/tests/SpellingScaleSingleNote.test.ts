import { AccidentalType } from "@/types/enums/AccidentalType";
import { GlobalMode } from "@/types/enums/GlobalMode";
import { ScaleModeType } from "@/types/enums/ScaleModeType";
import { KeyDisplayMode } from "@/types/enums/KeyDisplayMode";
import { ScalePlaybackMode } from "@/types/enums/ScalePlaybackMode";
import { createNoteWithOctave } from "@/types/interfaces/NoteWithOctave";
import { ixScaleDegree, scaleDegreeToIndex } from "@/types/ScaleModes/ScaleDegreeType";
import { ixChromatic } from "@/types/ChromaticIndex";
import { MusicalKey } from "@/types/Keys/MusicalKey";

import { HarmonyInputMode } from "@/types/enums/HarmonyInputMode";

import { MusicalDisplayFormatter } from "@/utils/formatters/MusicalDisplayFormatter";
import { MusicalKeyNoteFormatter } from "@/utils/formatters/MusicalKeyNoteFormatter";
import { ActualNoteResolver } from "@/utils/resolvers/ActualNoteResolver";
import { SpellingUtils } from "@/utils/SpellingUtils";
import {
  ChordDisplayKind,
  resolveChordDisplayContext,
} from "@/utils/spelling/ChordDisplayContext";
import { resolveSpellingContext } from "@/utils/spelling/SpellingContext";
import { getScaleStepAtDegree } from "@/utils/SequencePlaybackUtils";
import { GreekTestConstants } from "@/tests/utils/GreekTestConstants";
import { SpellingTestUtils } from "@/tests/utils/SpellingTestUtils";
import { ChordDisplayMode } from "@/types/enums/SettingModes";

describe("SpellingScaleSingleNote", () => {
  const constants = GreekTestConstants.getInstance();

  test("C Phrygian ii single-note playback spells Db on staff, not C#", () => {
    const key = constants.C_PHRYGIAN_KEY;
    const step = getScaleStepAtDegree(
      key,
      scaleDegreeToIndex(ixScaleDegree(2)),
      ScalePlaybackMode.SingleNote,
    );

    const spelling = resolveSpellingContext({
      globalMode: GlobalMode.Scales,
      musicalKey: key,
      currentChordRef: step.chordRef,
    });
    const result = SpellingUtils.computeNotesForStaff(
      step.notesToPlay!,
      key.getStaffSpellingKey(),
      spelling,
    );

    // Ab major key signature absorbs the flat onto D.
    SpellingTestUtils.verifyNoteWithOctaveArray(result, [
      createNoteWithOctave("D", AccidentalType.None),
    ]);
  });

  test("C Phrygian ii scale spelling is Db before key signature", () => {
    const key = constants.C_PHRYGIAN_KEY;
    const step = getScaleStepAtDegree(
      key,
      scaleDegreeToIndex(ixScaleDegree(2)),
      ScalePlaybackMode.SingleNote,
    );

    const result = step.notesToPlay!.map((actualIndex) =>
      ActualNoteResolver.resolveNoteInScaleWithOctave(key, actualIndex),
    );

    SpellingTestUtils.verifyNoteWithOctaveArray(result, [
      createNoteWithOctave("D", AccidentalType.Flat),
    ]);
  });

  test("C Phrygian ii single-note chord name spells Db, not C#", () => {
    const key = constants.C_PHRYGIAN_KEY;
    const step = getScaleStepAtDegree(
      key,
      scaleDegreeToIndex(ixScaleDegree(2)),
      ScalePlaybackMode.SingleNote,
    );

    const displayContext = resolveChordDisplayContext({
      globalMode: GlobalMode.Scales,
      harmonyInputMode: HarmonyInputMode.ChordPresets,
      currentChordRef: step.chordRef,
    });
    expect(displayContext.kind).toBe(ChordDisplayKind.FromIndices);
    const useScaleNoteSpelling =
      displayContext.kind === ChordDisplayKind.FromIndices &&
      displayContext.useScaleNoteSpelling;

    const displayInfo = MusicalDisplayFormatter.getDisplayInfoFromIndices(
      step.notesToPlay!,
      ChordDisplayMode.Symbols,
      key,
      useScaleNoteSpelling,
    );

    expect(displayInfo.chordName).toBe("D♭");
  });

  test("C double harmonic major b2 single-note spells Db with open C major staff key", () => {
    const key = MusicalKey.fromGreekMode("C", ScaleModeType.DoubleHarmonicMajor);
    const step = getScaleStepAtDegree(
      key,
      scaleDegreeToIndex(ixScaleDegree(2)),
      ScalePlaybackMode.SingleNote,
    );

    const spelling = resolveSpellingContext({
      globalMode: GlobalMode.Scales,
      musicalKey: key,
      currentChordRef: step.chordRef,
    });
    const result = SpellingUtils.computeNotesForStaff(
      step.notesToPlay!,
      key.getStaffSpellingKey(),
      spelling,
    );

    SpellingTestUtils.verifyNoteWithOctaveArray(result, [
      createNoteWithOctave("D", AccidentalType.Flat),
    ]);
  });

  test("C Phrygian ii note-name keyboard label spells Db", () => {
    const key = constants.C_PHRYGIAN_KEY;
    const label = MusicalKeyNoteFormatter.formatNoteForDisplay(
      key,
      ixChromatic(1),
      KeyDisplayMode.NoteNames,
    );
    expect(label).toBe("D♭");
  });
});
