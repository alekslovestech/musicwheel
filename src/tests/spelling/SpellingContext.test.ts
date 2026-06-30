import { ChordType } from "@/types/enums/ChordType";
import { GlobalMode } from "@/types/enums/GlobalMode";
import { ScaleModeType } from "@/types/enums/ScaleModeType";
import { ScalePlaybackMode } from "@/types/enums/ScalePlaybackMode";
import { makeChordReference } from "@/types/interfaces/ChordReference";
import { MusicalKey } from "@/types/Keys/MusicalKey";
import { ixScaleDegree, scaleDegreeToIndex } from "@/types/ScaleModes/ScaleDegreeType";

import {
  resolveSpellingContext,
  SpellingKind,
} from "@/utils/spelling/SpellingContext";
import { getScaleStepAtDegree } from "@/utils/SequencePlaybackUtils";
import { GreekTestConstants } from "@/tests/utils/GreekTestConstants";

describe("resolveSpellingContext", () => {
  const constants = GreekTestConstants.getInstance();

  test("Scales without chord ref => ScaleDegree", () => {
    const key = constants.C_PHRYGIAN_KEY;
    const result = resolveSpellingContext({
      globalMode: GlobalMode.Scales,
      musicalKey: key,
      currentChordRef: undefined,
    });
    expect(result).toEqual({ kind: SpellingKind.ScaleDegree, musicalKey: key });
  });

  test("Scales with triad chord ref => ChordPreset", () => {
    const key = constants.C_PHRYGIAN_KEY;
    const step = getScaleStepAtDegree(
      key,
      scaleDegreeToIndex(ixScaleDegree(2)),
      ScalePlaybackMode.Triad,
    );
    const result = resolveSpellingContext({
      globalMode: GlobalMode.Scales,
      musicalKey: key,
      currentChordRef: step.chordRef,
    });
    expect(result.kind).toBe(SpellingKind.ChordPreset);
    if (result.kind === SpellingKind.ChordPreset) {
      expect(result.chordRef).toBe(step.chordRef);
    }
  });

  test("Harmony with spellable chord ref => ChordPreset", () => {
    const key = MusicalKey.fromGreekMode("C", ScaleModeType.Ionian);
    const chordRef = makeChordReference(0, ChordType.Major, 0);
    const result = resolveSpellingContext({
      globalMode: GlobalMode.Harmony,
      musicalKey: key,
      currentChordRef: chordRef,
    });
    expect(result).toEqual({ kind: SpellingKind.ChordPreset, chordRef });
  });

  test("Harmony without chord ref => KeySignature", () => {
    const key = MusicalKey.fromGreekMode("C", ScaleModeType.Ionian);
    const result = resolveSpellingContext({
      globalMode: GlobalMode.Harmony,
      musicalKey: key,
      currentChordRef: undefined,
    });
    expect(result).toEqual({
      kind: SpellingKind.KeySignature,
      musicalKey: key.getStaffSpellingKey(),
    });
  });
});
