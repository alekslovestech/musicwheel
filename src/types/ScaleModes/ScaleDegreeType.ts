import { SEVEN } from "@/types/constants/NoteConstants";

type Branded<K, T> = K & { __brand: T };

// For array indices (0-6), -1 for invalid values
export type ScaleDegreeIndex = Branded<number, "ScaleDegreeIndex">;

// For scale degrees (1-7), -1 for invalid values
export type ScaleDegree = Branded<number, "ScaleDegree">;

// Conversion functions
export function ixScaleDegreeIndex(n: number): ScaleDegreeIndex {
  if ((n < 0 && n !== -1) || n > 6 || !Number.isInteger(n))
    throw new Error("Invalid ScaleDegreeIndex=" + n);
  return n as ScaleDegreeIndex;
}

export function ixScaleDegree(n: number): ScaleDegree {
  if ((n < 1 && n !== -1) || n > 7 || !Number.isInteger(n))
    throw new Error("Invalid ScaleDegree=" + n);
  return n as ScaleDegree;
}

/**
 * Returns true if the shorter circular path from `from` to `to` on the
 * diatonic scale (1–7) is descending. Ties (distance = 3.5, not possible
 * with mod 7) default to ascending.
 *
 * Examples: I→VII = down 1 (true), V→vi = up 1 (false), I→V = down 3 (true).
 */
export function scaleDegreeGoesDown(from: ScaleDegree, to: ScaleDegree): boolean {
  const circDown = (from - to + SEVEN) % SEVEN;
  const circUp = (to - from + SEVEN) % SEVEN;
  return circDown < circUp;
}
