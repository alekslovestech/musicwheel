import { ChordReference, makeChordReference } from "@/types/interfaces/ChordReference";
import { createNoteWithOctave, NoteWithOctave, NoteWithOctaveArray } from "@/types/interfaces/NoteWithOctave";

import { NoteGroupingId } from "@/types/NoteGroupingId";

import { ActualIndex, actualToChromatic, InversionIndex, NoteIndices } from "@/types/IndexTypes";
import { MusicalKey } from "@/types/Keys/MusicalKey";

import { ChordUtils } from "@/utils/ChordUtils";
import { AccidentalPreferenceResolver } from "@/utils/resolvers/AccidentalPreferenceResolver";
import { ActualNoteResolver } from "@/utils/resolvers/ActualNoteResolver";
import { SpellingContext, SpellingKind } from "@/utils/spelling/SpellingContext";

export class SpellingUtils {
  static computeNotesForStaff(
    selectedNoteIndices: NoteIndices,
    staffSpellingKey: MusicalKey,
    spelling: SpellingContext,
  ): NoteWithOctaveArray {
    switch (spelling.kind) {
      case SpellingKind.ChordPreset:
        return this.applyKeySignatureToNotes(
          this.computeNotesFromChordPreset(selectedNoteIndices, spelling.chordRef),
          staffSpellingKey,
        );
      case SpellingKind.ScaleDegree:
        return this.applyKeySignatureToNotes(
          selectedNoteIndices.map((actualIndex) =>
            ActualNoteResolver.resolveNoteInScaleWithOctave(spelling.musicalKey, actualIndex),
          ),
          staffSpellingKey,
        );
      case SpellingKind.KeySignature:
        return this.computeNotesFromMusicalKey(selectedNoteIndices, spelling.musicalKey);
    }
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
