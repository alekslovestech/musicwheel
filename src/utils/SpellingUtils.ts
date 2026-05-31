import { ChordReference, makeChordReference } from "@/types/interfaces/ChordReference";
import { createNoteWithOctave, NoteWithOctave, NoteWithOctaveArray } from "@/types/interfaces/NoteWithOctave";

import { NoteGroupingId } from "@/types/NoteGroupingId";

import { ActualIndex, actualToChromatic, InversionIndex, NoteIndices } from "@/types/IndexTypes";
import { MusicalKey } from "@/types/Keys/MusicalKey";

import { ChordUtils } from "@/utils/ChordUtils";
import { AccidentalPreferenceResolver } from "@/utils/resolvers/AccidentalPreferenceResolver";
import { ActualNoteResolver } from "@/utils/resolvers/ActualNoteResolver";

export class SpellingUtils {
  static computeNotesForStaff(
    selectedNoteIndices: NoteIndices,
    selectedMusicalKey: MusicalKey,
    currentChordRef?: ChordReference,
  ): NoteWithOctaveArray {
    if (currentChordRef) {
      return this.applyKeySignatureToNotes(
        this.computeNotesFromChordPreset(selectedNoteIndices, currentChordRef),
        selectedMusicalKey,
      );
    }
    return this.computeNotesFromMusicalKey(selectedNoteIndices, selectedMusicalKey);
  }

  static computeNotesFromMusicalKey(
    actualIndices: NoteIndices,
    selectedMusicalKey: MusicalKey,
  ): NoteWithOctaveArray {
    return actualIndices.map((actualIndex) =>
      ActualNoteResolver.resolveNoteInKeyWithOctave(selectedMusicalKey, actualIndex),
    );
  }

  static computeFirstNoteFromChordPreset(
    baseIndex: ActualIndex,
    selectedChordType: NoteGroupingId,
    selectedInversionIndex: InversionIndex,
  ): NoteWithOctave {
    const chordRef = makeChordReference(baseIndex, selectedChordType, selectedInversionIndex);

    const chordIndices = ChordUtils.calculateChordNotesFromChordReference(chordRef);

    return this.computeSingleNoteFromChordPreset(chordIndices[0], chordRef);
  }

  private static computeNotesFromChordPreset(
    chordIndices: NoteIndices,
    chordRef: ChordReference,
  ): NoteWithOctaveArray {
    return chordIndices.map((actualIndex) =>
      this.computeSingleNoteFromChordPreset(actualIndex, chordRef),
    );
  }

  private static computeSingleNoteFromChordPreset(
    targetNoteIndex: ActualIndex,
    chordRef: ChordReference,
  ): NoteWithOctave {
    const rootIndex = chordRef.rootNote;
    const rootChromaticIndex = actualToChromatic(rootIndex);
    const accidentalPreference = AccidentalPreferenceResolver.getChordPresetSpellingPreference(
      chordRef.id,
      rootChromaticIndex,
    );
    return ActualNoteResolver.resolveAbsoluteNoteWithOctave(targetNoteIndex, accidentalPreference);
  }

  private static applyKeySignatureToNotes(
    notes: NoteWithOctaveArray,
    musicalKey: MusicalKey,
  ): NoteWithOctaveArray {
    return notes.map((note) =>
      createNoteWithOctave(
        note.noteName,
        musicalKey.keySignature.applyToNote(note.noteName, note.accidental),
        note.octaveOffset,
      ),
    );
  }
}
