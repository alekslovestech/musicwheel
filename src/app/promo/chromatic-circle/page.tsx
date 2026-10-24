import type { Metadata } from "next";

import { PromoStage } from "@/app/promo/PromoStage";
import { THUMBNAIL_HEIGHT } from "@/lib/thumbnail";
import { ChordWheel } from "@/components/Learn/figures/ChordWheel";
import { SpecialType } from "@/types/enums/SpecialType";

/** Source for public/thumbnails/chromatic-circle.png, the link preview image for the chromatic circle
 * article. Not linked from the site. `yarn generate-promo` screenshots this page at 1200x630. */
export const metadata: Metadata = {
  title: "Promo: The Chromatic Circle",
  robots: { index: false, follow: false },
};

/** The wheel is as tall as the stage; it's a circle, so the stage's width is left as margin. */
export default function ChromaticCirclePromoPage() {
  return (
    <PromoStage>
      <div style={{ width: THUMBNAIL_HEIGHT, height: THUMBNAIL_HEIGHT }}>
        <ChordWheel
          rootNote="C"
          chordType={SpecialType.None}
          inversionIndex={0}
          caption=""
          showKeyboard={false}
          bare
        />
      </div>
    </PromoStage>
  );
}
