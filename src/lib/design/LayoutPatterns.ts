export const LAYOUT_PATTERNS = {
  // Common size patterns
  fullSize: "h-full w-full",

  // Common flex patterns
  centerFlex: "flex items-center justify-center",
  centerFlexCol: "flex flex-col items-center justify-center",
  /** Settings columns: horizontal center, vertical top (avoids stretch + justify-center drift). */
  topFlexCol: "flex flex-col items-center justify-start",
  centerFlexRowGap: "flex flex-row items-center justify-center gap-snug",
  /** Shared min-height for transport + transpose when shown side by side (md action + w-8 icon). */
  coupledActionSlot: "flex items-center justify-center min-h-12",
  spaceBetween: "flex items-center justify-between",

  // Common overflow patterns
  scrollContainer: "overflow-hidden min-h-0",
  clippedContainer: "overflow-hidden",
} as const;
