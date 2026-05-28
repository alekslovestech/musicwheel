import { TWELVE } from "@/types/constants/NoteConstants";
import { IntervalClass, ixIntervalClass } from "@/types/IntervalClass";
import chroma from "chroma-js";

/** Interval class (0–6) → color. Used for chord mixing and any interval-based coloring. */
export const INTERVAL_CLASS_COLORS: Record<IntervalClass, chroma.Color> = {
  0: chroma.rgb(222, 222, 222), // Unison/Octave - Light Gray
  1: chroma.rgb(219, 20, 61), // m2 / M7 - Crimson
  2: chroma.rgb(255, 166, 0), // M2 / m7 - Orange
  3: chroma.rgb(255, 215, 0), // m3 / M6 - Gold
  4: chroma.rgb(50, 205, 50), // M3 / m6 - Green
  5: chroma.rgb(37, 99, 235), // P4 / P5 - Blue
  6: chroma.rgb(255, 0, 255), // Tritone - Magenta
};

/** Only 1 (m2/M7) and 6 (tritone) pull extra; rest are flat. */
export const INTERVAL_CLASS_DISSONANCE: Record<IntervalClass, number> = {
  0: 0, // Unison/Octave
  1: 0.9, // m2 / M7
  2: 0, // M2 / m7 (softer so sus2/sus4 don’t look harsh)
  3: 0, // m3 / M6
  4: 0, // M3 / m6
  5: 0, // P4 / P5
  6: 1, // Tritone
};

/** Map semitone interval to interval class (0–6). */
export function intervalClass(semitone: number): IntervalClass {
  const mod = semitone % TWELVE;
  return ixIntervalClass(Math.min(mod, TWELVE - mod));
}
