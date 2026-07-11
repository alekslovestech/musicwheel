import { IntervalClass } from "@/types/IntervalClass";
import chroma from "chroma-js";

/** Interval class (0–6) → color. Used for chord mixing and any interval-based coloring. */
export const INTERVAL_CLASS_COLORS: Record<IntervalClass, chroma.Color> = {
  0: chroma.rgb(120, 120, 125), // Unison/Octave - Light Gray
  1: chroma.rgb(219, 20, 61), // m2 / M7 - Crimson
  2: chroma.rgb(255, 166, 0), // M2 / m7 - Orange
  3: chroma.rgb(255, 215, 0), // m3 / M6 - Gold
  4: chroma.rgb(50, 205, 50), // M3 / m6 - Green
  5: chroma.rgb(37, 99, 235), // P4 / P5 - Blue
  6: chroma.rgb(255, 0, 255), // Tritone - Magenta
};
