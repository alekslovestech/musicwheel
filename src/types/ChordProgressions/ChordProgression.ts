import { MusicalKey } from "@/types/Keys/MusicalKey";
import { AbsoluteChord } from "@/types/AbsoluteChord";
import {
  type ChordProgressionEntry,
  DEFAULT_CHORD_PROGRESSION_DURATION,
  type LilypondDuration,
} from "@/types/ChordProgressions/ChordProgressionEntry";
import { RomanResolver } from "@/utils/resolvers/RomanResolver";

export type { ChordProgressionEntry, LilypondDuration };
export { DEFAULT_CHORD_PROGRESSION_DURATION };

export const DEFAULT_CHORD_PROGRESSION_BPM = 120;

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

  constructor(
    progression_as_strings: string[],
    name: string | undefined,
    tempo: number = DEFAULT_CHORD_PROGRESSION_BPM,
  ) {
    this.progression = progression_as_strings.map((roman) => ({
      romanChord: RomanResolver.createRomanChordFromString(roman),
      duration: DEFAULT_CHORD_PROGRESSION_DURATION,
    }));
    this.name = name || "Unknown";
    this.tempo = tempo;
  }

  getChordAtIndex(index: number, musicalKey: MusicalKey): AbsoluteChord {
    return this.resolvedChords(musicalKey)[index];
  }

  resolvedChords(musicalKey: MusicalKey): AbsoluteChord[] {
    return this.progression.map(({ romanChord }) =>
      RomanResolver.resolveRomanChord(romanChord, musicalKey),
    );
  }
}
