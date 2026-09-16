import type chroma from "chroma-js";

import { COMMON_STYLES } from "@/lib/design";

/** A small colored square matching the wheel/ribbon's interval-class color language. Pure
 * presentational - no client-only behavior - so it's safe to use from server-rendered pages
 * (e.g. Learn articles) as well as from the interactive ribbon. A <span>, not a <div>, so it's
 * phrasing content and can sit inline inside a <p> (e.g. next to a roman numeral in prose). */
export function ColorSwatch({
  color,
  isActive = false,
  extraClassName = "",
}: {
  color: chroma.Color;
  isActive?: boolean;
  /** Additional classes merged onto the swatch's own - e.g. margin or sizing from the caller's
   * layout - kept separate from `className` to avoid shadowing the built-in classes below. */
  extraClassName?: string;
}) {
  return (
    <span
      className={`${COMMON_STYLES.colorSwatch} ${
        isActive ? COMMON_STYLES.colorSwatchActive : ""
      } ${extraClassName}`}
      style={{ backgroundColor: color.css() }}
    />
  );
}
