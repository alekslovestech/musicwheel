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
  stepLabel:
    "absolute top-0 text-center text-[10px] font-medium leading-none text-labels-textDefault",
  connectorOverlay: "pointer-events-none absolute inset-x-0 top-0",
  connectorBar: "absolute top-0 h-1 rounded-full",

  /** Shared by RibbonNoteSwatch and RibbonNoteTick - same cell shape, different contents. */
  noteCell: "flex min-w-0 flex-1 flex-col items-center gap-0.5",
  interactiveCell:
    "cursor-pointer rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-keys-scaleBoundaryColor",

  tickMark: "h-3 shrink-0 rounded-full",
  tickMarkActive: "w-1 bg-keys-scaleBoundaryColor",
  tickMarkInactive: "w-0.5 bg-containers-divider",

  tickLabel: "flex h-5 min-w-5 items-center justify-center",
  tickLabelActive: "rounded-full border-2 border-keys-scaleBoundaryColor",
} as const;
