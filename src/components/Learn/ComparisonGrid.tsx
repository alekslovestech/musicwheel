import { LEARN_STYLES } from "@/lib/design";

/**
 * Layout wrappers for placing a fixed number of figures side by side in a learn article. Each one
 * is sized on the assumption its children are StaticChordFigure-sized - a small square-ish card -
 * but nothing here is chord-specific: any figures of roughly that size can go in any of these
 * (ScaleFigure included, per the existing comparison articles). The children tuple is typed to the
 * exact count on purpose, so passing the wrong number of figures is a type error rather than a
 * silently broken layout.
 */

export function ComparisonGrid2({
  children,
}: {
  children: readonly [React.ReactNode, React.ReactNode];
}) {
  return <div className={LEARN_STYLES.comparisonGrid}>{children}</div>;
}

/** Two figures side by side in portrait, the third centered underneath; all three in one row
 * once there's room (sm and up). */
export function ComparisonGrid3({
  children,
}: {
  children: readonly [React.ReactNode, React.ReactNode, React.ReactNode];
}) {
  return <div className={LEARN_STYLES.comparisonGrid3}>{children}</div>;
}

export function ComparisonGrid4({
  children,
}: {
  children: readonly [React.ReactNode, React.ReactNode, React.ReactNode, React.ReactNode];
}) {
  return <div className={LEARN_STYLES.comparisonGrid}>{children}</div>;
}
