import { AccidentalType } from "@/types/enums/AccidentalType";

export interface NoteInfo {
  readonly noteName: string;
  readonly accidental: AccidentalType;
}

export function createNoteInfo(noteName: string, accidental: AccidentalType): NoteInfo {
  return { noteName, accidental };
}
