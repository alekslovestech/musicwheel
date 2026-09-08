import { MAX_SCALE_DEGREE_COUNT } from "@/types/constants/NoteConstants";

type Branded<K, T> = K & { __brand: T };

// For array indices (0-6 diatonic, up to 0-7 for a non-diatonic OtherScaleInfo), -1 for invalid values
export type ScaleDegreeIndex = Branded<number, "ScaleDegreeIndex">;

// For scale degrees (1-7 diatonic, up to 1-8 for a non-diatonic OtherScaleInfo), -1 for invalid values
export type ScaleDegree = Branded<number, "ScaleDegree">;

// Conversion functions
export function ixScaleDegreeIndex(n: number): ScaleDegreeIndex {
  if (n < 0 || n >= MAX_SCALE_DEGREE_COUNT || !Number.isInteger(n))
    throw new Error("Invalid ScaleDegreeIndex=" + n);
  return n as ScaleDegreeIndex;
}

export function ixScaleDegree(n: number): ScaleDegree {
  if (n < 1 || n > MAX_SCALE_DEGREE_COUNT || !Number.isInteger(n))
    throw new Error("Invalid ScaleDegree=" + n);
  return n as ScaleDegree;
}

export function scaleDegreeToIndex(degree: ScaleDegree): ScaleDegreeIndex {
  return ixScaleDegreeIndex(degree - 1);
}

export function scaleDegreeIndexToDegree(index: ScaleDegreeIndex): ScaleDegree {
  return ixScaleDegree(index + 1);
}
