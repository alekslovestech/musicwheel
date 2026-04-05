import type { NoteWithOctave } from "@/types/interfaces/NoteWithOctave";

export type NoteLength = 1 | 2 | 4 | 8 | 16 | 32;

export function isNoteLength(n: number): n is NoteLength {
  return n === 1 || n === 2 || n === 4 || n === 8 || n === 16 || n === 32;
}

export type Durated<T> = {
  value: T;
  noteLength?: NoteLength;
};

/** Simultaneous pitches (e.g. a chord) sharing one rhythmic value. */
export type DuratedNoteChord = Durated<NoteWithOctave[]>;

export function makeDurated<T>(value: T, noteLength?: NoteLength): Durated<T> {
  return { value, noteLength };
}
