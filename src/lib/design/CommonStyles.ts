import { LAYOUT_PATTERNS } from "./LayoutPatterns";

export const COMMON_STYLES = {
  staff: `${LAYOUT_PATTERNS.fullSize} ${LAYOUT_PATTERNS.centerFlex} px-tight md:px-snug rounded`,

  keyboardCircular: `p-snug ${LAYOUT_PATTERNS.clippedContainer} max-h-full rounded`,
  keyboardLinear: `${LAYOUT_PATTERNS.fullSize} ${LAYOUT_PATTERNS.centerFlex} ${LAYOUT_PATTERNS.clippedContainer} rounded`,

  circularContainer: `relative p-snug overflow-hidden max-h-full rounded`,
  circularInner: `${LAYOUT_PATTERNS.fullSize} ${LAYOUT_PATTERNS.centerFlex}`,

  linearContainer: `${LAYOUT_PATTERNS.fullSize} ${LAYOUT_PATTERNS.centerFlex} overflow-hidden rounded`,
  linearInner: `${LAYOUT_PATTERNS.fullSize}`,

  settingsPanel: `flex overflow-hidden gap-snug h-full min-h-0 box-border rounded`,

  pageContainer: `${LAYOUT_PATTERNS.fullSize} flex flex-col px-tight md:px-loose lg:px-spacious`,
  pageGrid: `grid gap-tight ${LAYOUT_PATTERNS.clippedContainer} flex-1`,
} as const;
