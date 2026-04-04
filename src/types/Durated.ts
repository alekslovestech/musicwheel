export type NoteLength = 1 | 2 | 4 | 8 | 16 | 32;

export function isNoteLength(n: number): n is NoteLength {
  return n === 1 || n === 2 || n === 4 || n === 8 || n === 16 || n === 32;
}

export type Durated<T> = {
  value: T;
  noteLength?: NoteLength;
};

export function makeDurated<T>(
  value: T,
  noteLength: NoteLength | undefined = undefined,
): Durated<T> {
  return { value, noteLength };
}
