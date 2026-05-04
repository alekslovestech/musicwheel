import { TWELVE } from "./constants/NoteConstants";

type Branded<K, T> = K & { __brand: T };
export type IntervalClass = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export type IntervalDistance = Branded<number, "IntervalDistance">;

export function ixIntervalClass(n: number): IntervalClass {
  if (n < 0 || n > 6 || !Number.isInteger(n)) throw new Error("Invalid IntervalClass=" + n);
  return n as IntervalClass;
}

export function ixIntervalDistance(n: number): IntervalDistance {
  if (n < 0 || n > TWELVE || !Number.isInteger(n)) throw new Error("Invalid IntervalDistance=" + n);
  return n as IntervalDistance;
}
