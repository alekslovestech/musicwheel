import type { RomanChord } from "@/types/RomanChord";
import { makeDurated, type Durated, type NoteLength } from "@/types/Durated";
import { DEFAULT_MUSICAL_KEY, type MusicalKey } from "@/types/Keys/MusicalKey";
import { RomanResolver } from "@/utils/resolvers/RomanResolver";

export const DEFAULT_CHORD_PROGRESSION_BPM = 120;
/** Default step length when no `:denominator` is given on the first token (quarter). */
export const DEFAULT_CHORD_PROGRESSION_NOTE_LENGTH: NoteLength = 4;

/**
 * LilyPond-style carry: each step uses its explicit `:denominator` if present,
 * otherwise the previous step's length and dot count.
 */
export function applyCarriedProgressionDurations(
  entries: Durated<RomanChord>[],
): Durated<RomanChord>[] {
  let lastNoteLength = DEFAULT_CHORD_PROGRESSION_NOTE_LENGTH;
  let lastRhythmDots = 0;
  const result: Durated<RomanChord>[] = [];
  for (const entry of entries) {
    if (entry.noteLength !== undefined) {
      lastNoteLength = entry.noteLength;
      lastRhythmDots = entry.rhythmDots ?? 0;
    }
    result.push(makeDurated(entry.value, lastNoteLength, lastRhythmDots));
  }
  return result;
}

// Represents a chord progression
export class ChordProgression {
  /** Harmony and rhythmic length per step (LilyPond-style denominator; omitted tokens inherit the previous length). */
  progression: Durated<RomanChord>[];
  name: string;
  /** Whole progression tempo in beats per minute (beat = quarter note). */
  tempo: number;
  /** Optional metadata: recommended key to use when selecting this progression. */
  suggestedMusicalKey: MusicalKey;

  get length(): number {
    return this.progression.length;
  }

  constructor(
    progression_as_strings: string[],
    name: string | undefined,
    tempo: number = DEFAULT_CHORD_PROGRESSION_BPM,
    suggestedMusicalKey: MusicalKey = DEFAULT_MUSICAL_KEY,
  ) {
    this.progression = applyCarriedProgressionDurations(
      progression_as_strings.map((roman) => RomanResolver.parseRomanChordWithDuration(roman)),
    );
    this.name = name || "Unknown";
    this.tempo = tempo;
    this.suggestedMusicalKey = suggestedMusicalKey;
  }
}
