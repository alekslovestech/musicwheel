import { ChordType } from "@/types/enums/ChordType";
import { GlobalMode } from "@/types/enums/GlobalMode";
import { HarmonyInputMode } from "@/types/enums/HarmonyInputMode";
import { ScaleModeType } from "@/types/enums/ScaleModeType";
import { ScalePlaybackMode } from "@/types/enums/ScalePlaybackMode";
import { makeChordReference } from "@/types/interfaces/ChordReference";
import { MusicalKey } from "@/types/Keys/MusicalKey";
import { ixScaleDegree, scaleDegreeToIndex } from "@/types/ScaleModes/ScaleDegreeType";

import {
  ChordDisplayKind,
  resolveChordDisplayContext,
} from "@/utils/spelling/ChordDisplayContext";
import { getScaleStepAtDegree } from "@/utils/SequencePlaybackUtils";
import { GreekTestConstants } from "@/tests/utils/GreekTestConstants";

describe("resolveChordDisplayContext", () => {
  const constants = GreekTestConstants.getInstance();

  test("Scales single-note => FromIndices with scale note spelling", () => {
    const key = constants.C_PHRYGIAN_KEY;
    const step = getScaleStepAtDegree(
      key,
      scaleDegreeToIndex(ixScaleDegree(2)),
      ScalePlaybackMode.SingleNote,
    );
    const result = resolveChordDisplayContext({
      globalMode: GlobalMode.Scales,
      harmonyInputMode: HarmonyInputMode.ChordPresets,
      currentChordRef: step.chordRef,
    });
    expect(result).toEqual({
      kind: ChordDisplayKind.FromIndices,
      useScaleNoteSpelling: true,
    });
  });

  test("Scales triad => FromIndices", () => {
    const key = constants.C_PHRYGIAN_KEY;
    const step = getScaleStepAtDegree(
      key,
      scaleDegreeToIndex(ixScaleDegree(2)),
      ScalePlaybackMode.Triad,
    );
    const result = resolveChordDisplayContext({
      globalMode: GlobalMode.Scales,
      harmonyInputMode: HarmonyInputMode.ChordPresets,
      currentChordRef: step.chordRef,
    });
    expect(result).toEqual({
      kind: ChordDisplayKind.FromIndices,
      useScaleNoteSpelling: true,
    });
  });

  test("Harmony chord presets with spellable ref => ChordPreset", () => {
    const chordRef = makeChordReference(0, ChordType.Major, 0);
    const result = resolveChordDisplayContext({
      globalMode: GlobalMode.Harmony,
      harmonyInputMode: HarmonyInputMode.ChordPresets,
      currentChordRef: chordRef,
    });
    expect(result).toEqual({ kind: ChordDisplayKind.ChordPreset });
  });

  test("Harmony single note => FromIndices without scale note spelling", () => {
    const key = MusicalKey.fromGreekMode("C", ScaleModeType.Ionian);
    const step = getScaleStepAtDegree(
      key,
      scaleDegreeToIndex(ixScaleDegree(1)),
      ScalePlaybackMode.SingleNote,
    );
    const result = resolveChordDisplayContext({
      globalMode: GlobalMode.Harmony,
      harmonyInputMode: HarmonyInputMode.SingleNote,
      currentChordRef: step.chordRef,
    });
    expect(result).toEqual({
      kind: ChordDisplayKind.FromIndices,
      useScaleNoteSpelling: false,
    });
  });

  test("Harmony chord presets without chord ref => FromIndices", () => {
    const result = resolveChordDisplayContext({
      globalMode: GlobalMode.Harmony,
      harmonyInputMode: HarmonyInputMode.ChordPresets,
      currentChordRef: undefined,
    });
    expect(result).toEqual({
      kind: ChordDisplayKind.FromIndices,
      useScaleNoteSpelling: false,
    });
  });
});
