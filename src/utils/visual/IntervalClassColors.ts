import { IntervalClass } from "@/types/IntervalClass";
import chroma from "chroma-js";
import { INTERVAL_CLASS_PALETTE } from "@/lib/design/palette";

/**
 * Interval class (0–6) → color. Used for chord mixing and any interval-based coloring.
 * Values come from the shared palette so the Tailwind theme and this pipeline cannot drift.
 */
const INTERVAL_CLASS_COLORS: Record<IntervalClass, chroma.Color> = {
  0: chroma(INTERVAL_CLASS_PALETTE[0]),
  1: chroma(INTERVAL_CLASS_PALETTE[1]),
  2: chroma(INTERVAL_CLASS_PALETTE[2]),
  3: chroma(INTERVAL_CLASS_PALETTE[3]),
  4: chroma(INTERVAL_CLASS_PALETTE[4]),
  5: chroma(INTERVAL_CLASS_PALETTE[5]),
  6: chroma(INTERVAL_CLASS_PALETTE[6]),
};
export const DEFAULT_INTERVAL_CLASS_COLOR = INTERVAL_CLASS_COLORS[0];

export function colorForIntervalClass(ic: IntervalClass): chroma.Color {
  return INTERVAL_CLASS_COLORS[ic];
}
