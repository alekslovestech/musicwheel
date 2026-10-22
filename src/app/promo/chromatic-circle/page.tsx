import type { Metadata } from "next";

import { StaticChordFigure } from "@/components/Learn/StaticChordFigure";
import { SpecialType } from "@/types/enums/SpecialType";

/** Source for public/thumbnails/chromatic-circle.png, the link preview image for the chromatic circle
 * article. Not linked from the site. `yarn generate-promo` screenshots this page at 1200x630. */
export const metadata: Metadata = {
  title: "Promo: The Chromatic Circle",
  robots: { index: false, follow: false },
};

export default function ChromaticCirclePromoPage() {
  return (
    <main className="flex h-screen w-screen items-center justify-center overflow-hidden bg-white">
      <div className="h-[660px] w-[660px] [&_figure]:border-transparent [&_figure]:bg-transparent">
        <StaticChordFigure
          rootNote="C"
          chordType={SpecialType.None}
          inversionIndex={0}
          caption=""
          showKeyboard={false}
        />
      </div>
    </main>
  );
}
