/**
 * Class names for ScaleRibbon and its note/tick cells - only the ones that carry real meaning
 * (a color/typography treatment, or an active/inactive pair). Single-use structural glue
 * ("relative", "flex flex-col" for one specific wrapper) stays inline at its call site instead -
 * naming it here would cost a lookup without describing a reusable look.
 */
export const RIBBON_STYLES = {
  title: "text-xs font-medium uppercase tracking-wide text-labels-textDefault opacity-70",
  caption: "text-center text-[10px] italic leading-tight text-labels-textDefault opacity-60",

  annotationToggle:
    "shrink-0 rounded border px-tight py-px text-[10px] font-medium uppercase tracking-wide transition-colors",
  annotationToggleActive:
    "border-buttons-borderSelected bg-buttons-bgSelected text-buttons-textSelected",
  annotationToggleInactive:
    "border-containers-divider text-labels-textDefault opacity-70 hover:bg-buttons-bgHover hover:opacity-100",

  /** Shared by both note-row layouts (swatches and ticks) - their cell centers must line up. */
  noteRow: "flex items-end",
  /** Notes ribbon only: ticks are positioned absolutely by semitone offset rather than by equal
   *  flex cells, so the row needs an explicit height (tickMark h-3 + gap-0.5 + tickLabel h-5). */
  noteRowProportional: "relative h-[34px]",
  connectorOverlay: "pointer-events-none absolute inset-x-0 top-0",
  connectorBar: "absolute top-0 h-1 rounded-full",

  /** Shared by RibbonNoteSwatch and RibbonNoteTick - same cell shape, different contents. */
  noteCell: "flex min-w-0 flex-1 flex-col items-center gap-0.5",
  /** RibbonNoteTick when positioned by semitone offset instead of by equal flex cell - see
   *  chromaticPositionStyle. `w-0` + `items-center` centers each child (tick, label) on this
   *  element's own `left` position without a transform: a zero-width flex container has no space
   *  to distribute, so alignment splits the child's full width evenly to either side of that
   *  point. */
  noteCellAbsolute: "absolute top-0 flex w-0 flex-col items-center gap-0.5 whitespace-nowrap",
  interactiveCell:
    "cursor-pointer rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-keys-scaleBoundaryColor",

  tickMark: "h-3 shrink-0 rounded-full",
  tickMarkActive: "w-1 bg-keys-scaleBoundaryColor",
  tickMarkInactive: "w-0.5 bg-containers-divider",

  tickLabel: "flex h-5 min-w-5 items-center justify-center",
  tickLabelActive: "rounded-full border-2 border-keys-scaleBoundaryColor",
} as const;
