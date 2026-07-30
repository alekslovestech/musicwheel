// Relative (not "@/") on purpose: tailwind.config.ts imports this module through Tailwind's
// own loader, which does not resolve the project's path aliases. Type-only, so it is erased.
import type { IntervalClass } from "../../types/IntervalClass";

// Single source of truth for color values shared across the two color systems:
// the Tailwind theme (chrome/UI tokens, consumed as class names) and the
// chroma-based musical color pipeline (computed per-chord, consumed as inline styles).
//
// Keep this module dependency-free — it is imported at Tailwind build time. Purely-UI colors
// belong in tailwind.config.ts directly; only values that cross the boundary, or that more
// than one module derives from, live here.

/** Interval class (0–6) → base color. Mixed in LCH by ColorUtils to produce chord colors. */
export const INTERVAL_CLASS_PALETTE: Record<IntervalClass, string> = {
  0: "rgb(120, 120, 125)", // Unison/Octave - Light Gray
  1: "rgb(219, 20, 61)", // m2 / M7 - Crimson
  2: "rgb(255, 166, 0)", // M2 / m7 - Orange
  3: "rgb(255, 215, 0)", // m3 / M6 - Gold
  4: "rgb(50, 205, 50)", // M3 / m6 - Green
  5: "rgb(37, 99, 235)", // P4 / P5 - Blue
  6: "rgb(255, 0, 255)", // Tritone - Magenta
};

/**
 * Alpha applied to a mixed note/chord color when it is used as a background highlight
 * rather than a foreground mark — staff notes, progression cells, ribbon steps.
 */
export const HIGHLIGHT_ALPHA = 0.32;
