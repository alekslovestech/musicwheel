import { Factory, StaveNote } from "vexflow";

import { DEFAULT_CHORD_PROGRESSION_NOTE_LENGTH } from "@/types/ChordProgressions/ChordProgression";
import { MusicalKey } from "@/types/Keys/MusicalKey";
import { isMajor } from "@/types/enums/KeyType";
import { type DuratedNoteChord, type NoteLength } from "@/types/Durated";

import { NoteWithOctave } from "@/types/interfaces/NoteWithOctave";
import { AccidentalFormatter } from "@/utils/formatters/AccidentalFormatter";

export class VexFlowFormatter {
  static formatNote(note: NoteWithOctave, baseOctave: number = 4): string {
    return `${note.noteName}/${baseOctave + note.octaveOffset}`;
  }

  static noteLengthToVexDuration(noteLength: NoteLength): string {
    switch (noteLength) {
      case 1:
        return "w";
      case 2:
        return "h";
      case 4:
        return "q";
      case 8:
        return "8";
      case 16:
        return "16";
      case 32:
        return "32";
      default: {
        const _exhaustive: never = noteLength;
        return _exhaustive;
      }
    }
  }

  private static createStaveChordNote(
    step: DuratedNoteChord,
    factory: Factory,
  ): StaveNote {
    const duration = VexFlowFormatter.noteLengthToVexDuration(
      step.noteLength ?? DEFAULT_CHORD_PROGRESSION_NOTE_LENGTH,
    );
    const keys = step.value.map((noteWithOctave, index) => ({
      key: VexFlowFormatter.formatNote(noteWithOctave),
      accidentalSign: AccidentalFormatter.getAccidentalSignForEasyScore(
        noteWithOctave.accidental,
      ),
      index,
    }));

    const chordNote = factory.StaveNote({
      keys: keys.map((k) => k.key),
      duration,
    });

    keys.forEach(({ accidentalSign, index }) => {
      if (accidentalSign) {
        chordNote.addModifier(
          factory.Accidental({ type: accidentalSign }),
          index,
        );
      }
    });

    return chordNote;
  }

  static createStaveChordNotes(
    steps: DuratedNoteChord[],
    factory: Factory,
  ): StaveNote[] {
    return steps.map((step) =>
      VexFlowFormatter.createStaveChordNote(step, factory),
    );
  }

  static getKeySignatureForVex(musicalKey: MusicalKey) {
    const pureKey = musicalKey.tonicString;
    const majorMinor = isMajor(musicalKey.classicalMode) ? "" : "m";
    return pureKey + majorMinor;
  }
}
