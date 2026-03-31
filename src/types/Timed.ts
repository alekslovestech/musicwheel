export type NoteLength = 1 | 2 | 4 | 8 | 16 | 32;

export function isNoteLength(n: number): n is NoteLength {
  return n === 1 || n === 2 || n === 4 || n === 8 || n === 16 || n === 32;
}

export type Timed<T> = {
  value: T;
  noteLength?: NoteLength;
};

export function makeTimed<T>(
  value: T,
  noteLength: NoteLength | undefined = undefined,
): Timed<T> {
  return { value, noteLength };
}
