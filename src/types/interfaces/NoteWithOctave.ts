import { AccidentalType } from "../enums/AccidentalType";
import { ixOctaveOffset, OctaveOffset } from "../IndexTypes";

// Class that combines NoteInfo with octave offset information
export interface NoteWithOctave {
  readonly noteName: string;
  readonly accidental: AccidentalType;
  readonly octaveOffset: OctaveOffset;
}

export type NoteWithOctaveArray = readonly NoteWithOctave[];

// Factory function for convenient creation
export function createNoteWithOctave(
  noteName: string,
  accidental: AccidentalType,
  octaveOffset: number = 0,
): NoteWithOctave {
  return {
    noteName,
    accidental,
    octaveOffset: ixOctaveOffset(octaveOffset),
  };
}
