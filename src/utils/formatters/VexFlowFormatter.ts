import { Dot, Factory, StaveNote, Stem } from "vexflow";

import { DEFAULT_CHORD_PROGRESSION_NOTE_LENGTH } from "@/types/ChordProgressions/ChordProgression";
import { MusicalKey } from "@/types/Keys/MusicalKey";
import { isMajor } from "@/types/enums/KeyType";
import { type DuratedNoteChord, type NoteLength } from "@/types/Durated";

import { NoteWithOctave } from "@/types/interfaces/NoteWithOctave";
import { AccidentalType } from "@/types/enums/AccidentalType";
import { AccidentalFormatter } from "@/utils/formatters/AccidentalFormatter";
import { NoteConverter } from "@/utils/NoteConverter";

/** Semitones above C4 for B4 (the middle line of the treble clef). */
const TREBLE_MIDDLE_LINE_SEMITONES = 11; // B4

/** Tracks per-measure accidental state for a staff position (VexFlow note key, e.g. `d/4`). */
export class StaffAccidentalCache {
  private readonly active = new Map<string, AccidentalType>();

  /** Returns whether an accidental modifier should be drawn; updates measure state. */
  shouldDrawAccidental(staffPositionKey: string, accidental: AccidentalType): boolean {
    const previous = this.active.get(staffPositionKey);
    if (previous === accidental) return false;

    this.active.set(staffPositionKey, accidental);
    return accidental !== AccidentalType.None;
  }
}

export class VexFlowFormatter {
  static formatNote(note: NoteWithOctave, baseOctave: number = 4): string {
    return `${note.noteName}/${baseOctave + note.octaveOffset}`;
  }

  /** Undotted VexFlow duration; rhythm dots are passed via `dots` on `factory.StaveNote`. */
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

  /** Returns the stem direction for a chord based on the average pitch of its notes
      relative to B4, the middle line of the treble clef. */
  private static stemDirectionForChord(notes: readonly NoteWithOctave[]): number {
    if (notes.length === 0) return Stem.UP;
    const totalSemitones = notes.reduce(
      (sum, note) => sum + NoteConverter.noteWithOctaveToActual(note),
      0,
    );
    const avg = totalSemitones / notes.length;
    return avg > TREBLE_MIDDLE_LINE_SEMITONES ? Stem.DOWN : Stem.UP;
  }

  private static createStaveChordNote(
    step: DuratedNoteChord,
    factory: Factory,
    accidentalCache: StaffAccidentalCache,
  ): StaveNote {
    const duration = VexFlowFormatter.noteLengthToVexDuration(
      step.noteLength ?? DEFAULT_CHORD_PROGRESSION_NOTE_LENGTH,
    );
    const dots = step.rhythmDots ?? 0;
    const keys = step.value.map((noteWithOctave, index) => ({
      key: VexFlowFormatter.formatNote(noteWithOctave),
      noteWithOctave,
      index,
    }));

    const stemDirection = VexFlowFormatter.stemDirectionForChord(step.value);
    const chordNote = factory.StaveNote({
      keys: keys.map((k) => k.key),
      duration,
      stemDirection,
      ...(dots > 0 ? { dots } : {}),
    });

    if (dots > 0) {
      for (let d = 0; d < dots; d++) {
        Dot.buildAndAttach([chordNote], { all: true });
      }
    }

    keys.forEach(({ key, noteWithOctave, index }) => {
      const accidentalSign = AccidentalFormatter.getAccidentalSignForEasyScore(
        noteWithOctave.accidental,
      );
      if (accidentalSign && accidentalCache.shouldDrawAccidental(key, noteWithOctave.accidental)) {
        chordNote.addModifier(factory.Accidental({ type: accidentalSign }), index);
      }
    });

    return chordNote;
  }

  static createStaveChordNotes(steps: DuratedNoteChord[], factory: Factory): StaveNote[] {
    const accidentalCache = new StaffAccidentalCache();
    return steps.map((step) =>
      VexFlowFormatter.createStaveChordNote(step, factory, accidentalCache),
    );
  }

  static getKeySignatureForVex(musicalKey: MusicalKey) {
    const pureKey = musicalKey.tonicString;
    const majorMinor = isMajor(musicalKey.classicalMode) ? "" : "m";
    return pureKey + majorMinor;
  }
}
