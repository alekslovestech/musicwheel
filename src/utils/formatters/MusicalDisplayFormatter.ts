import { TWELVE } from "@/types/constants/NoteConstants";
import { SpecialType } from "@/types/enums/SpecialType";
import { ChordType } from "@/types/enums/ChordType";

import { ChordDisplayInfo } from "@/types/interfaces/ChordDisplayInfo";
import {
  ChordReference,
  makeChordReference,
  makeEmptyChordReference,
  makeUnknownChordReference,
} from "@/types/interfaces/ChordReference";

import { MusicalKey } from "@/types/Keys/MusicalKey";

import { isIntervalType, NoteGroupingId } from "@/types/NoteGroupingId";
import { ChordDisplayMode, ChordTypeContext } from "@/types/SettingModes";
import {
  ActualIndex,
  InversionIndex,
  ixActual,
  ixInversion,
  actualToChromatic,
  addOffsetToActual,
  NoteIndices,
} from "@/types/IndexTypes";
import { NoteGrouping } from "@/types/NoteGrouping";
import { NoteGroupingLibrary } from "@/types/NoteGroupingLibrary";

import { NoteConverter } from "@/utils/NoteConverter";
import { IndexUtils } from "@/utils/IndexUtils";
import { ChordUtils } from "@/utils/ChordUtils";
import { SpellingUtils } from "@/utils/SpellingUtils";
import { AccidentalPreferenceResolver } from "@/utils/resolvers/AccidentalPreferenceResolver";
import { ActualNoteResolver } from "@/utils/resolvers/ActualNoteResolver";

import { NoteFormatter } from "./NoteFormatter";

export class MusicalDisplayFormatter {
  static getDisplayInfoFromIndices(
    indices: NoteIndices,
    chordDisplayMode: ChordDisplayMode,
    musicalKey: MusicalKey
  ): ChordDisplayInfo {
    const chordRef = this.getChordReferenceFromIndices(indices);
    const noteGrouping = NoteGrouping.getNoteGroupingTypeFromNumNotes(
      indices.length
    );

    let chordName = "";
    if (chordRef) {
      chordName =
        chordRef.id === ChordType.Unknown
          ? this.formatUnknownChordName(chordRef, musicalKey)
          : this.deriveChordNameFromReference(
              chordRef,
              chordDisplayMode,
              musicalKey
            );
    }

    return {
      noteGroupingString: noteGrouping.toString(),
      chordName,
    };
  }

  static getChordPresetDisplayInfo(
    selectedNoteIndices: NoteIndices,
    chordRef: ChordReference,
    chordDisplayMode: ChordDisplayMode
  ): ChordDisplayInfo {
    if (selectedNoteIndices.length === 0) {
      return { noteGroupingString: "None", chordName: "Ø" };
    }

    if (selectedNoteIndices.length === 2) {
      const chordTypeName = NoteGroupingLibrary.getChordTypeName(
        chordRef.id,
        ChordTypeContext.ChordName
      );
      return { noteGroupingString: "Interval", chordName: chordTypeName };
    }

    const chordName = this.buildChordNameFromReference(
      chordRef,
      chordDisplayMode
    );

    const noteGrouping = NoteGrouping.getNoteGroupingTypeFromNumNotes(
      selectedNoteIndices.length
    );

    return {
      noteGroupingString: noteGrouping.toString(),
      chordName,
    };
  }

  /**
   * Gets chord type name for display.
   * For chord names, uses standard notation: Major="", Minor="m", etc.
   * For preset buttons, uses full names: Major="Maj", Minor="min", etc.
   */
  private static getChordTypeName(
    chordId: NoteGroupingId,
    displayMode: ChordDisplayMode
  ): string {
    // Use the new method instead of the old getId
    return NoteGroupingLibrary.getChordNameSuffix(chordId, displayMode);
  }

  private static buildChordNameFromReference(
    chordRef: ChordReference,
    chordDisplayMode: ChordDisplayMode
  ): string {
    // Get root spelling using the existing method
    const rootNoteWithOctave = SpellingUtils.computeFirstNoteFromChordPreset(
      chordRef.rootNote,
      chordRef.id,
      ixInversion(0) // Root position
    );
    const rootSpelling = NoteFormatter.formatForDisplay(rootNoteWithOctave);

    // For chord names, use standard short form: "" for major, "m" for minor
    const chordTypeName = this.getChordTypeName(chordRef.id, chordDisplayMode);

    // Root position case
    if (chordRef.inversionIndex === 0) {
      return `${rootSpelling}${chordTypeName}`;
    }

    // Inversion case - use the same bass note calculation as deriveChordNameFromReference
    const bassNote = this.calculateBassNoteFromReference(chordRef);

    // For bass note spelling, we need to use the chord's accidental preference
    const rootChromaticIndex = actualToChromatic(chordRef.rootNote);
    const accidentalPreference =
      AccidentalPreferenceResolver.getChordPresetSpellingPreference(
        chordRef.id,
        rootChromaticIndex
      );
    const bassNoteWithOctave = ActualNoteResolver.resolveAbsoluteNoteWithOctave(
      bassNote,
      accidentalPreference
    );
    const bassSpelling = NoteFormatter.formatForDisplay(bassNoteWithOctave);

    return `${rootSpelling}${chordTypeName}/${bassSpelling}`;
  }

  // We need to modify getChordReferenceFromIndices to preserve the bass note information
  static getChordReferenceFromIndices(
    indices: NoteIndices
  ): ChordReference | null {
    if (indices.length === 0) return makeEmptyChordReference();

    const normalizedIndices = IndexUtils.normalizeIndices(indices);

    // Try to find in root position first (most common case)
    const rootPositionMatch = this.findRootPositionMatch(
      normalizedIndices,
      indices
    );
    if (rootPositionMatch) return rootPositionMatch;

    // Then try inversions
    const inversionMatch = this.findInversionMatch(normalizedIndices, indices);
    if (inversionMatch) return inversionMatch;

    // Fallback to unknown chord
    return makeUnknownChordReference(indices);
  }

  // Add a new method that also returns the original bass note
  static getChordReferenceWithBassFromIndices(indices: NoteIndices): {
    chordRef: ChordReference | null;
    bassNote: ActualIndex | null;
  } {
    const chordRef = this.getChordReferenceFromIndices(indices);
    const bassNote = indices.length > 0 ? indices[0] : null; // Assuming indices are sorted with bass note first

    return { chordRef, bassNote };
  }

  private static findRootPositionMatch(
    normalizedIndices: number[],
    originalIndices: NoteIndices
  ): ChordReference | null {
    const allIds = NoteGroupingLibrary.getAllIds();

    for (const id of allIds) {
      const definition = NoteGroupingLibrary.getGroupingById(id);
      if (!definition) continue;

      const inversionIndices = IndexUtils.normalizeIndices(definition.offsets);

      if (IndexUtils.areIndicesEqual(inversionIndices, normalizedIndices)) {
        return this.createChordReferenceIndices(
          originalIndices,
          id,
          ixInversion(0)
        );
      }
    }

    return null;
  }

  private static findInversionMatch(
    normalizedIndices: number[],
    originalIndices: NoteIndices
  ): ChordReference | null {
    const allIds = NoteGroupingLibrary.getAllIds();

    for (const id of allIds) {
      const definition = NoteGroupingLibrary.getGroupingById(id);
      if (!definition) continue;

      for (let i = 1 as InversionIndex; i < definition.inversions.length; i++) {
        const inversionIndices = IndexUtils.normalizeIndices(
          definition.inversions[i]
        );

        if (IndexUtils.areIndicesEqual(inversionIndices, normalizedIndices)) {
          return this.createChordReferenceIndices(originalIndices, id, i);
        }
      }
    }

    return null;
  }

  private static createChordReferenceIndices(
    indices: NoteIndices,
    id: NoteGroupingId,
    inversionIndex: InversionIndex
  ): ChordReference {
    // In chord recognition context, we need to calculate the root note differently
    // than in chord preset context. Here, indices are raw user input that matched
    // a specific chord pattern at a specific inversion level.

    if (inversionIndex === 0) {
      // Root position - first note is the root
      const rootNoteIndex = indices[0];
      return makeChordReference(rootNoteIndex, id, inversionIndex);
    } else {
      // Inversion - calculate root note and normalize to chromatic (0-11)
      // This is because inversions represent the same chord regardless of octave
      const chordOffsets = ChordUtils.getOffsetsFromIdAndInversion(
        id,
        inversionIndex
      );
      const bassOffset = chordOffsets[0]; // First offset in inversion
      const bassNote = indices[0]; // First note in user input (bass note)

      // Calculate root: bassNote = rootNote + bassOffset, so rootNote = bassNote - bassOffset
      let rootNote = bassNote - bassOffset;
      // Normalize to 0-11 range for inversions (chromatic root)
      while (rootNote < 0) rootNote += TWELVE;
      const rootNoteChromatic = ixActual(rootNote % TWELVE);
      return makeChordReference(rootNoteChromatic, id, inversionIndex);
    }
  }

  static deriveChordNameFromReference(
    chordRef: ChordReference,
    displayMode: ChordDisplayMode,
    selectedMusicalKey: MusicalKey,
    bassNote?: ActualIndex // Optional bass note override
  ): string {
    const selectedAccidental = selectedMusicalKey.getDefaultAccidental();
    const rootNoteName = NoteConverter.getNoteTextFromActualIndex(
      chordRef.rootNote,
      selectedAccidental
    );

    if (chordRef.id === SpecialType.None) return "Ø";
    if (chordRef.id === ChordType.Unknown) return `${rootNoteName}(?)`;

    // Clean, semantic chord name generation
    const chordTypeSuffix = NoteGroupingLibrary.getChordNameSuffix(
      chordRef.id,
      displayMode
    );

    if (isIntervalType(chordRef.id)) {
      return chordTypeSuffix;
    }

    // Root position case
    if (chordRef.inversionIndex === 0) {
      return `${rootNoteName}${chordTypeSuffix}`;
    }

    // Inversion case
    const actualBassNote =
      bassNote ?? this.calculateBassNoteFromReference(chordRef);
    const bassNoteName = NoteConverter.getNoteTextFromActualIndex(
      ixActual(actualBassNote % TWELVE),
      selectedAccidental
    );

    return `${rootNoteName}${chordTypeSuffix}/${bassNoteName}`;
  }

  private static calculateBassNoteFromReference(
    chordRef: ChordReference
  ): ActualIndex {
    const definition = NoteGroupingLibrary.getGroupingById(chordRef.id);
    const inversionOffsets = definition?.inversions?.[chordRef.inversionIndex];
    if (
      chordRef.inversionIndex === 0 ||
      !definition ||
      !inversionOffsets ||
      inversionOffsets.length === 0
    ) {
      return chordRef.rootNote;
    }

    const bassOffset = inversionOffsets[0]; // First note in inversion is the bass

    return addOffsetToActual(chordRef.rootNote, bassOffset);
  }

  // Enhanced method for deriving chord names that handles unknown chords better
  private static formatUnknownChordName(
    chordRef: ChordReference,
    selectedMusicalKey: MusicalKey
  ): string {
    const selectedAccidental = selectedMusicalKey.getDefaultAccidental();
    const rootNoteName = NoteConverter.getNoteTextFromActualIndex(
      chordRef.rootNote,
      selectedAccidental
    );

    return `${rootNoteName}(?)`;
  }
}
