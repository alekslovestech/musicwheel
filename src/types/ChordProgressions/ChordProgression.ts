import { MusicalKey } from "@/types/Keys/MusicalKey";
import { AbsoluteChord } from "@/types/AbsoluteChord";
import { RomanResolver } from "@/utils/resolvers/RomanResolver";

/** LilyPond-style note length denominator (1 = whole, 4 = quarter, 8 = eighth, …). */
type ChordProgressionNoteDuration = number;

const DEFAULT_CHORD_PROGRESSION_DURATION: ChordProgressionNoteDuration = 1;

export const DEFAULT_CHORD_PROGRESSION_BPM = 120;

/**
 * Milliseconds one chord should sound for, given BPM (beat = quarter) and a
 * LilyPond-style duration denominator (1 = whole, 4 = quarter, 8 = eighth).
 */
export function chordDurationMsFromTempo(
  tempoBpm: number = DEFAULT_CHORD_PROGRESSION_BPM,
  lilyPondDuration: ChordProgressionNoteDuration = DEFAULT_CHORD_PROGRESSION_DURATION,
): number {
  const msPerQuarter = 60000 / tempoBpm;
  const lengthInQuarters = 4 / lilyPondDuration;
  return msPerQuarter * lengthInQuarters;
}

export interface ChordProgressionEntry {
  roman: string;
  duration: ChordProgressionNoteDuration;
}

// Represents a chord progression
export class ChordProgression {
  /** Harmony and rhythmic length per step (duration is a LilyPond-style denominator). */
  progression: ChordProgressionEntry[];
  name: string;
  /** Whole progression tempo in beats per minute (beat = quarter note). */
  tempo: number;

  get length(): number {
    return this.progression.length;
  }

  /** Roman numerals only, in order. */
  get romans(): string[] {
    return this.progression.map((e) => e.roman);
  }

  constructor(
    progression_as_strings: string[],
    name: string | undefined,
    tempo: number = DEFAULT_CHORD_PROGRESSION_BPM,
  ) {
    this.progression = progression_as_strings.map((roman) => ({
      roman,
      duration: DEFAULT_CHORD_PROGRESSION_DURATION,
    }));
    this.name = name || "Unknown";
    this.tempo = tempo;
  }

  getChordAtIndex(index: number, musicalKey: MusicalKey): AbsoluteChord {
    return this.resolvedChords(musicalKey)[index];
  }

  resolvedChords(musicalKey: MusicalKey): AbsoluteChord[] {
    return this.progression.map(({ roman }) =>
      RomanResolver.resolveAsAbsoluteChord(roman, musicalKey),
    );
  }
}
