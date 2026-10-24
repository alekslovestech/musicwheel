import type { Metadata } from "next";

import { PromoStage } from "@/app/promo/PromoStage";
import { ScaleFigure } from "@/components/Learn/figures/ScaleFigure";
import { ScaleModeType } from "@/types/enums/ScaleModeType";
import { ScalePlaybackMode } from "@/types/enums/ScalePlaybackMode";
import { ixScaleDegree } from "@/types/ScaleModes/ScaleDegreeType";

/** Source for public/thumbnails/color-coding.png, the link preview image for the color coding
 * article. Not linked from the site. `yarn generate-promo` screenshots this page at 1200x630.
 *
 * The app's own scales view in Triad mode: the wheel with one triad selected, and the first four
 * cells of the triad ribbon beneath it, magnified. Which scale it is doesn't matter - harmonic
 * minor because its first triads (minor, diminished, augmented, minor) are ordinary and show
 * varied colors. The ribbon is its own figure so it can be magnified without the wheel; its
 * swatches are tiny at their natural size. */
export const metadata: Metadata = {
  title: "Promo: Color Coding",
  robots: { index: false, follow: false },
};

const RIBBON_ZOOM = 3;

const FIGURE_PROPS = {
  tonic: "C",
  scaleType: ScaleModeType.HarmonicMinor,
  caption: "",
  scalePlaybackMode: ScalePlaybackMode.Triad,
  highlightedDegree: ixScaleDegree(3),
} as const;

export default function ColorCodingPromoPage() {
  return (
    <PromoStage>
      <div className="flex flex-col items-center justify-center gap-6">
      {/* One-off: mute the wedge labels so the green triangle is the loudest thing on the wheel. */}
      <div className="w-[468px] [&_text]:opacity-30">
        <ScaleFigure {...FIGURE_PROPS} views={["wheel"]} bare />
      </div>
      <div className="w-[170px]" style={{ zoom: RIBBON_ZOOM }}>
        <ScaleFigure {...FIGURE_PROPS} views={["ribbon"]} ribbonCount={4} ribbonShowLabels={false} bare />
      </div>
      </div>
    </PromoStage>
  );
}
