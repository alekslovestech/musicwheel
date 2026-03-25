import { ChordType } from "../enums/ChordType";
import { SpecialType } from "../enums/SpecialType";
import {
  ActualIndex,
  InversionIndex,
  ixActual,
  ixInversion,
  NoteIndices,
} from "../IndexTypes";
import { NoteGroupingId } from "../NoteGroupingId";

export interface ChordReference {
  rootNote: ActualIndex;
  id: NoteGroupingId;
  inversionIndex: InversionIndex;
}

export function makeChordReference(
  rootNote: number,
  id: NoteGroupingId,
  inversionIndex: number = 0
): ChordReference {
  return {
    rootNote: ixActual(rootNote),
    id,
    inversionIndex: ixInversion(inversionIndex),
  };
}

export function makeEmptyChordReference(): ChordReference {
  return makeChordReference(0, SpecialType.None);
}

export function makeUnknownChordReference(
  indices: NoteIndices
): ChordReference {
  return makeChordReference(indices[0], ChordType.Unknown);
}
