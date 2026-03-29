import type { RomanChord } from "@/types/RomanChord";

/** LilyPond-style note length denominator (1 = whole, 4 = quarter, 8 = eighth, …). */
export type LilypondDuration = number;

export const DEFAULT_CHORD_PROGRESSION_DURATION: LilypondDuration = 4; // quarter is default

export interface ChordProgressionEntry {
  romanChord: RomanChord;
  duration: LilypondDuration | undefined;
}
