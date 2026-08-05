export const TYPOGRAPHY = {
  sectionTitle: "text-base font-bold",
  controlLabel: "text-sm font-medium",
  buttonText: "text-sm font-medium",
  chordNameText: "text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-bold",

  // Keyboard text (flat, non-nested)
  circularNoteText: "text-lg font-bold",
  circularRomanText: "text-sm font-bold",
  circularAccidental: "text-base",
  linearNoteText: "text-lg font-bold",
  linearAccidental: "text-lg",
} as const;

/** Longest chord name that still gets full size - "Absus2", "C#m7b5" and the like. */
export const CHORD_NAME_FULL_SIZE_MAX_CHARS = 6;

/** Bold glyphs average a little over half an em. Deliberately over-estimated, so a name that
 *  computes to exactly one container width still lands inside it. */
const CHORD_NAME_GLYPH_EM = 0.62;

const CHORD_NAME_MIN_SIZE = "0.75rem";
const CHORD_NAME_MAX_SIZE = "3rem";

/**
 * Font size for a chord name, as a container-relative `clamp`. Names up to
 * {@link CHORD_NAME_FULL_SIZE_MAX_CHARS} characters share the largest size; past that the size
 * falls as `1/length`, which is what makes even a long name ("Gbsus2#4") span one container
 * width rather than wrapping. Tiers were tried first and dropped - the longest tier had no upper
 * bound, so a long enough name overflowed it however the tiers were placed.
 *
 * Needs an ancestor with `container-type:inline-size`; without one `cqw` falls back to the
 * viewport. Returned as a value rather than a Tailwind class because it is continuous, and
 * Tailwind can only emit class names it can see written out as literals.
 */
export function chordNameFontSize(nameLength: number): string {
  const charsToFit = Math.max(nameLength, CHORD_NAME_FULL_SIZE_MAX_CHARS);
  const cqwPerName = 100 / (CHORD_NAME_GLYPH_EM * charsToFit);
  return `clamp(${CHORD_NAME_MIN_SIZE}, ${cqwPerName.toFixed(1)}cqw, ${CHORD_NAME_MAX_SIZE})`;
}
