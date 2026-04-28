import { NoteWithOctave } from "@/types/interfaces/NoteWithOctave";
import { AccidentalFormatter } from "./AccidentalFormatter";
import { NoteInfo } from "@/types/interfaces/NoteInfo";

export class NoteFormatter {
  static formatForDisplay(note: NoteWithOctave | NoteInfo | null): string {
    if (!note) return "";
    const accidentalSign = AccidentalFormatter.getAccidentalSignForDisplay(note.accidental);
    return `${note.noteName}${accidentalSign}`;
  }

  static formatForDebug(note: NoteWithOctave | NoteInfo): string {
    const accidentalSign = AccidentalFormatter.getAccidentalSignForDebug(note.accidental);
    return `${note.noteName}${accidentalSign}`;
  }
}
