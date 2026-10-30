import { AccidentalType } from "@/types/enums/AccidentalType";

import { addChromatic, ChromaticIndex, ixChromatic } from "@/types/ChromaticIndex";
import { ActualIndex, chromaticToActual } from "@/types/IndexTypes";
import { createNoteInfo, NoteInfo } from "@/types/interfaces/NoteInfo";
import { NoteWithOctave } from "@/types/interfaces/NoteWithOctave";

import { AccidentalFormatter } from "@/utils/formatters/AccidentalFormatter";
import { NoteFormatter } from "@/utils/formatters/NoteFormatter";
import { ActualNoteResolver } from "@/utils/resolvers/ActualNoteResolver";

const NATURAL_TO_CHROMATIC: Record<string, number> = {
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
  A: 9,
  B: 11,
};

const NOTE_STRING_REGEX = /^([A-G])(♯|#|♭|bb|b|𝄫|♮|n)?$/;

export class NoteConverter {
  // For testing and input - converts text to index
  static toChromaticIndex(note: string): ChromaticIndex {
    return this.tryToChromaticIndex(note) ?? ixChromatic(-1);
  }

  static tryToChromaticIndex(note: string): ChromaticIndex | null {
    const noteInfo = this.parseNoteInfo(note);
    return noteInfo && this.noteInfoToChromaticIndex(noteInfo);
  }

  /** Letter plus optional accidental, in display (♯ ♭ ♮ 𝄫) or plain (# b n bb) form. */
  static parseNoteInfo(note: string): NoteInfo | null {
    const match = note.match(NOTE_STRING_REGEX);
    if (!match) return null;
    return createNoteInfo(match[1], AccidentalFormatter.parseAccidentalType(match[2] ?? ""));
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
    return addChromatic(
      NATURAL_TO_CHROMATIC[noteInfo.noteName],
      AccidentalFormatter.toSemitoneOffset(noteInfo.accidental),
    );
  }

  static tryNoteInfoToChromaticIndex(noteInfo: NoteInfo): ChromaticIndex | null {
    return noteInfo.noteName in NATURAL_TO_CHROMATIC
      ? this.noteInfoToChromaticIndex(noteInfo)
      : null;
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
