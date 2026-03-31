import { MusicalKey } from "@/types/Keys/MusicalKey";
import { AbsoluteChord } from "@/types/AbsoluteChord";
import {
  type RomanChordWithDuration,
  DEFAULT_CHORD_PROGRESSION_DURATION,
  type LilypondDuration,
  applyCarriedProgressionDurations,
  makeRomanChordWithDuration,
} from "@/types/RomanChordWithDuration";
import { RomanResolver } from "@/utils/resolvers/RomanResolver";

export type {
  RomanChordWithDuration as ChordProgressionEntry,
  LilypondDuration,
};
export {
  applyCarriedProgressionDurations,
  DEFAULT_CHORD_PROGRESSION_DURATION,
  makeRomanChordWithDuration,
};

export const DEFAULT_CHORD_PROGRESSION_BPM = 120;

// Represents a chord progression
export class ChordProgression {
  /** Harmony and rhythmic length per step (LilyPond-style denominator; omitted tokens inherit the previous length). */
  progression: RomanChordWithDuration[];
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

  getChordAtIndex(index: number, musicalKey: MusicalKey): AbsoluteChord {
    const entry = this.progression[index];
    return RomanResolver.resolveRomanChordWithDuration(entry, musicalKey).chord;
  }
}
