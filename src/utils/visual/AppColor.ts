import chroma from "chroma-js";

export type AppColor = chroma.Color;

export function colorCss(color: AppColor): string {
  return color.css();
}
