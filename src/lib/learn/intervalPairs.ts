import { IntervalType } from "@/types/enums/IntervalType";

export interface IntervalPair {
  /** Distance in semitones of the smaller member, 1-6 - the same index the color palette uses. */
  intervalClass: 1 | 2 | 3 | 4 | 5 | 6;
  intervalA: IntervalType;
  intervalB: IntervalType;
  nameA: string;
  nameB: string;
}

/** Every interval alongside the one it inverts to (the two add up to an octave). The tritone is
 * its own inversion, so it appears as a pair of itself. Ordered by interval class. */
export const INTERVAL_PAIRS: IntervalPair[] = [
  {
    intervalClass: 1,
    intervalA: IntervalType.Minor2,
    intervalB: IntervalType.Major7,
    nameA: "Minor 2nd",
    nameB: "Major 7th",
  },
  {
    intervalClass: 2,
    intervalA: IntervalType.Major2,
    intervalB: IntervalType.Minor7,
    nameA: "Major 2nd",
    nameB: "Minor 7th",
  },
  {
    intervalClass: 3,
    intervalA: IntervalType.Minor3,
    intervalB: IntervalType.Major6,
    nameA: "Minor 3rd",
    nameB: "Major 6th",
  },
  {
    intervalClass: 4,
    intervalA: IntervalType.Major3,
    intervalB: IntervalType.Minor6,
    nameA: "Major 3rd",
    nameB: "Minor 6th",
  },
  {
    intervalClass: 5,
    intervalA: IntervalType.Fourth,
    intervalB: IntervalType.Fifth,
    nameA: "Perfect 4th",
    nameB: "Perfect 5th",
  },
  {
    intervalClass: 6,
    intervalA: IntervalType.Tritone,
    intervalB: IntervalType.Tritone,
    nameA: "Tritone",
    nameB: "Tritone",
  },
];
