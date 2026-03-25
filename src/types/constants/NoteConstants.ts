import { AccidentalType } from "@/types/enums/AccidentalType";

import { createNoteInfo, NoteInfo } from "@/types/interfaces/NoteInfo";

export const SEVEN = 7; // diatonic scale degrees per octave
export const TWELVE = 12; //the magic number
export const TWENTY4 = 2 * TWELVE;

export const WHITE_KEYS_PER_OCTAVE = 7;
export const WHITE_KEYS_PER_2OCTAVES = 2 * WHITE_KEYS_PER_OCTAVE;
export const BLACK_KEY_WIDTH_RATIO = 0.7;

export const NOTES_WITH_SHARP: NoteInfo[] = [
  createNoteInfo("C", AccidentalType.None),
  createNoteInfo("C", AccidentalType.Sharp),
  createNoteInfo("D", AccidentalType.None),
  createNoteInfo("D", AccidentalType.Sharp),
  createNoteInfo("E", AccidentalType.None),
  createNoteInfo("F", AccidentalType.None),
  createNoteInfo("F", AccidentalType.Sharp),
  createNoteInfo("G", AccidentalType.None),
  createNoteInfo("G", AccidentalType.Sharp),
  createNoteInfo("A", AccidentalType.None),
  createNoteInfo("A", AccidentalType.Sharp),
  createNoteInfo("B", AccidentalType.None),
];

export const NOTES_WITH_FLAT: NoteInfo[] = [
  createNoteInfo("C", AccidentalType.None),
  createNoteInfo("D", AccidentalType.Flat),
  createNoteInfo("D", AccidentalType.None),
  createNoteInfo("E", AccidentalType.Flat),
  createNoteInfo("E", AccidentalType.None),
  createNoteInfo("F", AccidentalType.None),
  createNoteInfo("G", AccidentalType.Flat),
  createNoteInfo("G", AccidentalType.None),
  createNoteInfo("A", AccidentalType.Flat),
  createNoteInfo("A", AccidentalType.None),
  createNoteInfo("B", AccidentalType.Flat),
  createNoteInfo("B", AccidentalType.None),
];
