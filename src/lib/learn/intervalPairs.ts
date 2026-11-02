import { IntervalType } from "@/types/enums/IntervalType";
import { NoteGroupingLibrary } from "@/types/NoteGroupingLibrary";

const ORDINAL_WORDS: Record<string, string> = {
  "2nd": "second",
  "3rd": "third",
  "4th": "fourth",
  "5th": "fifth",
  "6th": "sixth",
  "7th": "seventh",
};

/** The library's label for an interval with its ordinal spelled out ("Minor 3rd" -> "Minor
 * third"), for prose - the library keeps the numeral form for the app's own labels. */
export function intervalProseName(interval: IntervalType): string {
  const { longForm } = NoteGroupingLibrary.getGroupingById(interval);
  return longForm
    .split(" ")
    .map((word) => ORDINAL_WORDS[word] ?? word)
    .join(" ");
}

export interface IntervalPair {
  /** Distance in semitones of the smaller member, 1-6 - the same index the color palette uses. */
  intervalClass: 1 | 2 | 3 | 4 | 5 | 6;
  intervalA: IntervalType;
  intervalB: IntervalType;
}

/** Every interval alongside the one it inverts to (the two add up to an octave). The tritone is
 * its own inversion, so it appears as a pair of itself. Ordered by interval class. */
export const INTERVAL_PAIRS: IntervalPair[] = [
  {
    intervalClass: 1,
    intervalA: IntervalType.Minor2,
    intervalB: IntervalType.Major7,
  },
  {
    intervalClass: 2,
    intervalA: IntervalType.Major2,
    intervalB: IntervalType.Minor7,
  },
  {
    intervalClass: 3,
    intervalA: IntervalType.Minor3,
    intervalB: IntervalType.Major6,
  },
  {
    intervalClass: 4,
    intervalA: IntervalType.Major3,
    intervalB: IntervalType.Minor6,
  },
  {
    intervalClass: 5,
    intervalA: IntervalType.Fourth,
    intervalB: IntervalType.Fifth,
  },
  {
    intervalClass: 6,
    intervalA: IntervalType.Tritone,
    intervalB: IntervalType.Tritone,
  },
];
