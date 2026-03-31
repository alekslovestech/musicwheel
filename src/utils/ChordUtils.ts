import {
  chromaticToActual,
  ixActualArray,
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
  /**
   * Inversion whose bass pitch class matches {@link bassChromatic} for {@link rootChromatic}
   * under {@link chordType}. Falls back to root position if none match.
   */
  static inversionIndexForSlashBass(
    chordType: NoteGroupingId,
    rootChromatic: ChromaticIndex,
    bassChromatic: ChromaticIndex,
  ): InversionIndex {
    if (
      makeChromaticIndex(rootChromatic) === makeChromaticIndex(bassChromatic)
    ) {
      return ixInversion(0);
    }
    const def = NoteGroupingLibrary.getGroupingById(chordType);
    for (let i = 0; i < def.inversions.length; i++) {
      const offsets = this.getOffsetsFromIdAndInversion(
        chordType,
        ixInversion(i),
      );
      const bassPc = makeChromaticIndex(
        (rootChromatic as number) + (offsets[0] as number),
      );
      if (bassPc === makeChromaticIndex(bassChromatic)) {
        return ixInversion(i);
      }
    }
    return ixInversion(0);
  }

  /**
   * {@link rootOctaveOffset} is 0 or 1 (same convention as {@link chromaticToActual}).
   */
  static chordReferenceFromAbsoluteChord(
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

  /**
   * Given inverted chord indices, find the bass note (always the first note).
   * Example: E-G-C → bass note is E
   */
  static getBassNoteFromInvertedChord(
    invertedChordIndices: NoteIndices,
  ): ActualIndex {
    return invertedChordIndices[0] as ActualIndex;
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

  /**
   * Calculate chord notes where the clicked note becomes the bass note.
   * This is more intuitive than clicking on the root note.
   */
  static calculateChordNotesFromBassNote(
    bassIndex: ActualIndex,
    chordType: NoteGroupingId,
    inversionIndex: InversionIndex = ixInversion(0),
  ): NoteIndices {
    // Get the offsets for this chord type and inversion
    const chordOffsets = this.getOffsetsFromIdAndInversion(
      chordType,
      inversionIndex,
    );

    // The bass note is the first offset in the inversion
    const bassOffset = chordOffsets[0];

    // Calculate what root note would produce this bass note
    // bassIndex = rootIndex + bassOffset, so rootIndex = bassIndex - bassOffset
    const rootIndex = ixActual(bassIndex - bassOffset);

    const chordRef = makeChordReference(rootIndex, chordType, inversionIndex);
    // Now calculate the chord from this root, which will handle octave fitting
    return this.calculateChordNotesFromChordReference(chordRef);
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
    return ixActualArray(IndexUtils.fitChordToAbsoluteRange(newNotes));
  }
}
