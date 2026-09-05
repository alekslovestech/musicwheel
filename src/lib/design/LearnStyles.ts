export const LEARN_STYLES = {
  /** Side-by-side scale comparisons: unconditional 2-up, not width-breakpointed - a 2-column
   * grid is half-width at any viewport, so it stays side-by-side in portrait instead of
   * stacking, and gets roomier automatically in landscape. */
  comparisonGrid: "grid grid-cols-2 gap-tight sm:gap-normal",

  figureCard:
    "m-0 flex flex-col gap-tight rounded-lg border border-containers-divider bg-canvas-bgScales p-tight sm:gap-snug sm:p-normal",
  figureCaption: "flex flex-col gap-tight text-xs text-labels-textDefault sm:text-sm",
  /** Any inline text link in the learn section - figure captions, the article index, prose. */
  link: "underline underline-offset-2",
} as const;
