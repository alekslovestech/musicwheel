import { ChordType } from "@/types/enums/ChordType";
import { GlobalMode } from "@/types/enums/GlobalMode";
import { SpecialType } from "@/types/enums/SpecialType";
import { MusicalKey } from "@/types/Keys/MusicalKey";
import { ChordReference } from "@/types/interfaces/ChordReference";
import { NoteGroupingId } from "@/types/NoteGroupingId";

export enum SpellingKind {
  ChordPreset = "ChordPreset",
  ScaleDegree = "ScaleDegree",
  KeySignature = "KeySignature",
}

export type SpellingContext =
  | { kind: SpellingKind.ChordPreset; chordRef: ChordReference }
  | { kind: SpellingKind.ScaleDegree; musicalKey: MusicalKey }
  | { kind: SpellingKind.KeySignature; musicalKey: MusicalKey };

export type ResolveSpellingContextInput = {
  globalMode: GlobalMode;
  musicalKey: MusicalKey;
  currentChordRef?: ChordReference;
};

export function isSpellableChordRef(chordRef: ChordReference): boolean {
  const id: NoteGroupingId = chordRef.id;
  return (
    id !== SpecialType.None &&
    id !== SpecialType.Note &&
    id !== SpecialType.Freeform &&
    id !== ChordType.Unknown
  );
}

export function resolveSpellingContext(input: ResolveSpellingContextInput): SpellingContext {
  if (input.currentChordRef && isSpellableChordRef(input.currentChordRef)) {
    return { kind: SpellingKind.ChordPreset, chordRef: input.currentChordRef };
  }

  if (input.globalMode === GlobalMode.Scales) {
    return { kind: SpellingKind.ScaleDegree, musicalKey: input.musicalKey };
  }

  return {
    kind: SpellingKind.KeySignature,
    musicalKey: input.musicalKey.getStaffSpellingKey(),
  };
}
