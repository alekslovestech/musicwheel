import type { RomanChord } from "@/types/RomanChord";
import { makeTimed, type Timed, type NoteLength } from "@/types/Timed";
import { RomanResolver } from "@/utils/resolvers/RomanResolver";

export const DEFAULT_CHORD_PROGRESSION_BPM = 120;
/** Default step length when no `:denominator` is given on the first token (quarter). */
export const DEFAULT_CHORD_PROGRESSION_NOTE_LENGTH: NoteLength = 4;

/** LilyPond-style carry: each step uses its explicit `:denominator` if present, otherwise the previous step's length (initially {@link DEFAULT_CHORD_PROGRESSION_NOTE_LENGTH}). */
export function applyCarriedProgressionDurations(
  entries: Timed<RomanChord>[],
): Timed<RomanChord>[] {
  let lastNoteLength = DEFAULT_CHORD_PROGRESSION_NOTE_LENGTH;
  const result: Timed<RomanChord>[] = [];
  for (const entry of entries) {
    if (entry.noteLength !== undefined) {
      lastNoteLength = entry.noteLength;
    }
    result.push(makeTimed(entry.value, lastNoteLength));
  }
  return result;
}

// Represents a chord progression
export class ChordProgression {
  /** Harmony and rhythmic length per step (LilyPond-style denominator; omitted tokens inherit the previous length). */
  progression: Timed<RomanChord>[];
  name: string;
  /** Whole progression tempo in beats per minute (beat = quarter note). */
  tempo: number;

  get length(): number {
    return this.progression.length;
  }

  constructor(
    progression_as_strings: string[],
    name: string | undefined,
    tempo: number = DEFAULT_CHORD_PROGRESSION_BPM,
  ) {
    this.progression = applyCarriedProgressionDurations(
      progression_as_strings.map((roman) =>
        RomanResolver.parseRomanChordWithDuration(roman),
      ),
    );
    this.name = name || "Unknown";
    this.tempo = tempo;
  }
}
