import type { CSSProperties } from "react";

/** Sets --key-border-width to 0 for a figure's keyboards, thinner than the app's default 1px. */
export const FIGURE_KEY_BORDER = { "--key-border-width": "0" } as CSSProperties;

export const LEARN_STYLES = {
  /** Article title - one per page. */
  h1: "text-3xl font-semibold",
  /** Section heading within an article. */
  h2: "text-xl font-semibold",

  /** Side-by-side scale comparisons: unconditional 2-up, not width-breakpointed - a 2-column
   * grid is half-width at any viewport, so it stays side-by-side in portrait instead of
   * stacking, and gets roomier automatically in landscape. */
  comparisonGrid: "grid grid-cols-2 gap-tight sm:gap-normal",

  /** Three-up comparison base grid: two side by side in the first row in portrait, all three in
   * one row from sm up. ComparisonGrid3 wraps its third child itself to center it underneath the
   * first two in portrait - see that component for why it doesn't need an nth-child selector. */
  comparisonGrid3: "grid grid-cols-2 gap-tight sm:grid-cols-3 sm:gap-normal",

  figureCard:
    "m-0 flex flex-col gap-tight rounded-lg border border-containers-divider bg-canvas-bgScales p-tight sm:gap-snug sm:p-normal",
  figureCaption: "flex flex-col gap-tight text-center text-xs text-labels-textDefault sm:text-sm",
  /** Any inline text link in the learn section - figure captions, the article index, prose. */
  link: "underline underline-offset-2",

  /** Marks an index-page link that leads to more than one page (e.g. "Comparisons"), instead of a
   * single article - a distinct font stands in for the old "Section" text badge. Use instead of
   * `link` on the heading's <Link>. */
  sectionLink: "underline underline-offset-2 font-mono uppercase tracking-wide",

  /** Row of topic tags (see LearnTag) following a heading's link. */
  tagRow: "ml-2 inline-flex gap-1 align-middle",
  tagBadge:
    "rounded border border-containers-divider px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-labels-textDefault opacity-60",

  /** A roman numeral (chord symbol) inline in prose - bold so "I", "V", "i" don't read as plain
   * letters. Use via the <Roman> component rather than this class directly. */
  romanNumeral: "font-bold",

  /** Two-column list of comparison pairs. Each cell holds its own link to the same page rather
   * than one anchor wrapping the row (invalid inside a <tr>) - `group`/`group-hover` on the row
   * makes hovering either cell highlight both, so the pair still reads as one clickable unit. */
  comparisonTableRow: "group border-b border-containers-divider last:border-b-0",
  comparisonTableCellLink: "block px-snug py-tight no-underline group-hover:bg-canvas-bgScales",
} as const;
