import { GlobalMode } from "@/types/enums/GlobalMode";
import { HarmonyInputMode } from "@/types/enums/HarmonyInputMode";
import { ChordReference } from "@/types/interfaces/ChordReference";

import { isSpellableChordRef } from "./SpellingContext";

export enum ChordDisplayKind {
  ChordPreset = "ChordPreset",
  FromIndices = "FromIndices",
}

export type ChordDisplayContext =
  | { kind: ChordDisplayKind.ChordPreset }
  | { kind: ChordDisplayKind.FromIndices; useScaleNoteSpelling: boolean };

export type ResolveChordDisplayContextInput = {
  globalMode: GlobalMode;
  harmonyInputMode: HarmonyInputMode;
  currentChordRef?: ChordReference;
};

function isChordsOrIntervals(harmonyInputMode: HarmonyInputMode): boolean {
  return (
    harmonyInputMode === HarmonyInputMode.ChordPresets ||
    harmonyInputMode === HarmonyInputMode.IntervalPresets
  );
}

export function resolveChordDisplayContext(
  input: ResolveChordDisplayContextInput,
): ChordDisplayContext {
  if (
    input.globalMode !== GlobalMode.Scales &&
    isChordsOrIntervals(input.harmonyInputMode) &&
    input.currentChordRef != null &&
    isSpellableChordRef(input.currentChordRef)
  ) {
    return { kind: ChordDisplayKind.ChordPreset };
  }

  return {
    kind: ChordDisplayKind.FromIndices,
    useScaleNoteSpelling: input.globalMode === GlobalMode.Scales,
  };
}
