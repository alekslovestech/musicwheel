import {
  chromaticToActual,
  toNoteIndices,
  NoteIndices,
  InversionIndex,
  ixInversion,
  ActualIndex,
  OffsetIndex,
  ixActual,
} from "../types/IndexTypes";
import { AbsoluteChord } from "../types/AbsoluteChord";
import { ChromaticIndex, makeChromaticIndex } from "../types/ChromaticIndex";
import { NoteGroupingLibrary } from "../types/NoteGroupingLibrary";
import { NoteGroupingId } from "../types/NoteGroupingId";

import { IndexUtils } from "./IndexUtils";
import {
  ChordReference,
  makeChordReference,
} from "@/types/interfaces/ChordReference";

export class ChordUtils {
  static noteIndicesFromAbsoluteChord(
    chord: AbsoluteChord,
    rootOctaveOffset: number,
  ): NoteIndices {
    return this.calculateChordNotesFromChordReference(
      this.chordReferenceFromAbsoluteChord(chord, rootOctaveOffset),
    );
  }

  /**
   * Given the original (uninverted) chord indices, calculate what the bass note would be at a specific inversion.
   * Example: C-E-G (original) at inversion 1 → bass note is E
   */
  static getBassNoteFromOriginalChord(
    originalChordIndices: NoteIndices,
    inversionIndex: InversionIndex,
  ): ActualIndex {
    const reverseIndex = ixInversion(
      (originalChordIndices.length - inversionIndex) %
        originalChordIndices.length,
    );
    return originalChordIndices[reverseIndex] as ActualIndex;
  }

  static hasInversions = (id: NoteGroupingId): boolean => {
    const definition = NoteGroupingLibrary.getGroupingById(id);
    return definition?.offsets.length > 1;
  };

  static getOffsetsFromIdAndInversion(
    id: NoteGroupingId,
    inversionIndex: InversionIndex = ixInversion(0),
  ): OffsetIndex[] {
    const definition = NoteGroupingLibrary.getGroupingById(id);
    if (!definition) {
      console.warn(`No chord definition found for type: ${id}`);
      throw new Error(`Invalid chord type: ${id}`);
    }

    if (inversionIndex === 0) return definition.offsets;
    return definition.inversions[inversionIndex];
  }

  static calculateChordNotesFromChordReference(
    chordReference: ChordReference,
  ): NoteIndices {
    const chordOffsets = ChordUtils.getOffsetsFromIdAndInversion(
      chordReference.id,
      chordReference.inversionIndex,
    );
    const newNotes = chordOffsets.map(
      (offset: number) => (offset + chordReference.rootNote) as ActualIndex,
    );
    return toNoteIndices(IndexUtils.fitChordToAbsoluteRange(newNotes));
  }

  private static inversionIndexForSlashBass(
    chordType: NoteGroupingId,
    rootChromatic: ChromaticIndex,
    bassChromatic: ChromaticIndex,
  ): InversionIndex {
    // Normalize to pitch class for comparison
    const rootPc = makeChromaticIndex(rootChromatic);
    const bassPc = makeChromaticIndex(bassChromatic);

    if (rootPc === bassPc) return ixInversion(0);

    const def = NoteGroupingLibrary.getGroupingById(chordType);
    for (let i = 0; i < def.inversions.length; i++) {
      const offsets = this.getOffsetsFromIdAndInversion(
        chordType,
        ixInversion(i),
      );
      // Working with numbers, don't double up on type conversions
      const invBassPc = makeChromaticIndex(rootPc + offsets[0]);
      if (invBassPc === bassPc) return ixInversion(i);
    }
    return ixInversion(0);
  }

  private static chordReferenceFromAbsoluteChord(
    chord: AbsoluteChord,
    rootOctaveOffset: number,
  ): ChordReference {
    const inversion = this.inversionIndexForSlashBass(
      chord.chordType,
      chord.chromaticIndex,
      chord.bassNote,
    );
    return makeChordReference(
      chromaticToActual(chord.chromaticIndex, rootOctaveOffset),
      chord.chordType,
      inversion,
    );
  }
}
