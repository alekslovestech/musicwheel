import { AccidentalType } from "@/types/enums/AccidentalType";

import { ChromaticIndex, ixChromatic } from "@/types/ChromaticIndex";
import { ActualIndex, chromaticToActual } from "@/types/IndexTypes";
import { NoteInfo } from "@/types/interfaces/NoteInfo";
import { NoteWithOctave } from "@/types/interfaces/NoteWithOctave";

import { NoteFormatter } from "@/utils/formatters/NoteFormatter";
import { ActualNoteResolver } from "@/utils/resolvers/ActualNoteResolver";

const NOTE_TO_CHROMATIC: Record<string, number> = {
  C: 0,
  "C#": 1,
  Db: 1,
  D: 2,
  "D#": 3,
  Eb: 3,
  E: 4,
  F: 5,
  "F#": 6,
  Gb: 6,
  G: 7,
  "G#": 8,
  Ab: 8,
  A: 9,
  "A#": 10,
  Bb: 10,
  B: 11,
};

export class NoteConverter {
  // For testing and input - converts text to index
  static toChromaticIndex(note: string): ChromaticIndex {
    const chromatic = NOTE_TO_CHROMATIC[this.sanitizeNoteString(note)];
    return ixChromatic(chromatic ?? -1);
  }

  static tryToChromaticIndex(note: string): ChromaticIndex | null {
    const chromatic = NOTE_TO_CHROMATIC[this.sanitizeNoteString(note)];
    return chromatic === undefined ? null : ixChromatic(chromatic);
  }

  static sanitizeNoteString(noteString: string): string {
    // Convert display symbols to text format
    return noteString.replace(/[♯#]/g, "#").replace(/[♭b]/g, "b").replace(/[♮n]/g, "n");
  }

  static stripAccidentals(note: string): string {
    return note.replace(/[#b]/g, "");
  }

  // For display - converts index to text
  static fromChromaticIndex(index: ChromaticIndex, preferSharps: boolean = true): string {
    const sharpMap: { [key: number]: string } = {
      0: "C",
      1: "C#",
      2: "D",
      3: "D#",
      4: "E",
      5: "F",
      6: "F#",
      7: "G",
      8: "G#",
      9: "A",
      10: "A#",
      11: "B",
    };
    const flatMap: { [key: number]: string } = {
      0: "C",
      1: "Db",
      2: "D",
      3: "Eb",
      4: "E",
      5: "F",
      6: "Gb",
      7: "G",
      8: "Ab",
      9: "A",
      10: "Bb",
      11: "B",
    };
    return preferSharps ? sharpMap[index] : flatMap[index];
  }

  // Helper for testing - converts array of note names to indices
  static noteArrayToIndices(notes: string[]): ChromaticIndex[] {
    return notes.map((note) => this.toChromaticIndex(note));
  }

  static noteInfoToChromaticIndex(noteInfo: NoteInfo): ChromaticIndex {
    return this.toChromaticIndex(this.noteInfoToText(noteInfo));
  }

  static tryNoteInfoToChromaticIndex(noteInfo: NoteInfo): ChromaticIndex | null {
    return this.tryToChromaticIndex(this.noteInfoToText(noteInfo));
  }

  private static noteInfoToText(noteInfo: NoteInfo): string {
    const suffix =
      noteInfo.accidental === AccidentalType.Sharp
        ? "#"
        : noteInfo.accidental === AccidentalType.Flat
          ? "b"
          : "";
    return noteInfo.noteName + suffix;
  }

  static noteWithOctaveToActual(note: NoteWithOctave): ActualIndex {
    const chromatic = this.noteInfoToChromaticIndex(note);
    return chromaticToActual(chromatic, note.octaveOffset);
  }

  static getNoteTextFromActualIndex(
    actualIndex: ActualIndex,
    accidentalPreference: AccidentalType,
  ): string {
    const noteInfo = ActualNoteResolver.resolveAbsoluteNoteWithOctave(
      actualIndex,
      accidentalPreference,
    );
    return NoteFormatter.formatForDisplay(noteInfo);
  }
}
