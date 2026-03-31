import type { RomanChord } from "@/types/RomanChord";

/** LilyPond-style note length denominator (1 = whole, 4 = quarter, 8 = eighth, …). */
export type LilypondDuration = number;

export const DEFAULT_CHORD_PROGRESSION_DURATION: LilypondDuration = 4; // quarter is default

export interface RomanChordWithDuration {
  romanChord: RomanChord;
  duration: LilypondDuration | undefined;
}

export function makeRomanChordWithDuration(
  romanChord: RomanChord,
  duration: LilypondDuration | undefined = undefined,
): RomanChordWithDuration {
  return { romanChord, duration };
}

/** LilyPond-style carry: each step uses its explicit `:denominator` if present, otherwise the previous step's length (initially {@link DEFAULT_CHORD_PROGRESSION_DURATION}). */
export function applyCarriedProgressionDurations(
  entries: RomanChordWithDuration[],
): RomanChordWithDuration[] {
  let lastDuration = DEFAULT_CHORD_PROGRESSION_DURATION;
  return entries.map((entry) => {
    if (entry.duration !== undefined) {
      lastDuration = entry.duration;
    }
    return makeRomanChordWithDuration(entry.romanChord, lastDuration);
  });
}
