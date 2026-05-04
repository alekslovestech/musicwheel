import {
  DEFAULT_CHORD_PROGRESSION_BPM,
  DEFAULT_CHORD_PROGRESSION_NOTE_LENGTH,
} from "@/types/ChordProgressions/ChordProgression";
import type { NoteLength } from "@/types/Durated";

export class RhythmUtils {
  /**
   * Duration multiplier for a note with `dots` augmentation dots.
   * 0 dots → 1×, 1 dot → 1.5×, 2 dots → 1.75×, etc.
   */
  static dotMultiplier(dots: number): number {
    return 2 - 1 / Math.pow(2, dots);
  }

  /**
   * Column span of a note given a grid resolution of `columnsPerBar`.
   * Accounts for LilyPond-style augmentation dots.
   */
  static colSpan(noteLength: NoteLength, rhythmDots = 0, columnsPerBar: number): number {
    const base = columnsPerBar / noteLength;
    return rhythmDots > 0 ? base * this.dotMultiplier(rhythmDots) : base;
  }

  /**
   * Milliseconds one chord should sound for, given BPM (beat = quarter) and a
   * LilyPond-style note-length denominator (1 = whole, 4 = quarter, 8 = eighth).
   * Augmentation dots are handled by {@link RhythmUtils.dotMultiplier}.
   */
  static chordDurationMs(
    tempoBpm: number = DEFAULT_CHORD_PROGRESSION_BPM,
    noteLength: NoteLength = DEFAULT_CHORD_PROGRESSION_NOTE_LENGTH,
    rhythmDots = 0,
  ): number {
    const msPerQuarter = 60000 / tempoBpm;
    const lengthInQuarters =
      (4 / noteLength) * (rhythmDots > 0 ? this.dotMultiplier(rhythmDots) : 1);
    return msPerQuarter * lengthInQuarters;
  }
}
