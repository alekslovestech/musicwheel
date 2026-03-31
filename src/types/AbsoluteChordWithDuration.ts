import type { AbsoluteChord } from "@/types/AbsoluteChord";
import type { LilypondDuration } from "@/types/RomanChordWithDuration";

export interface AbsoluteChordWithDuration {
  chord: AbsoluteChord;
  /** LilyPond-style note length denominator (1 = whole, 4 = quarter, 8 = eighth, …). */
  duration: LilypondDuration;
}

export function makeAbsoluteChordWithDuration(
  chord: AbsoluteChord,
  duration: LilypondDuration,
): AbsoluteChordWithDuration {
  return { chord, duration };
}

