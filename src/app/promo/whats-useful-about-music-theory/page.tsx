import type { Metadata } from "next";

import { PromoStage } from "@/app/promo/PromoStage";
import { SpelledStaff } from "@/components/Learn/figures/SpelledStaff";
import { C_MAJOR_TRIAD, E_MAJOR_TRIAD } from "@/lib/learn/spelledFigures";

/** Source for public/thumbnails/whats-useful-about-music-theory.png, the link preview image for the
 * article. Not linked from the site. `yarn generate-promo` screenshots this page at 1200x630. */
export const metadata: Metadata = {
  title: "Promo: What's Useful About Music Theory",
  robots: { index: false, follow: false },
};

/** Magnifies each staff so the pair fills the 1200x630 frame; link previews get shrunk a lot. */
const FIGURE_ZOOM = 2.6;
/** The staff's width before zoom: just enough for the clef and a triad. */
const STAFF_WIDTH = 200;

export default function WhatsUsefulPromoPage() {
  return (
    <PromoStage>
      <div className="flex h-full w-full flex-col items-center justify-center gap-6">
        <div className="flex items-center justify-center gap-8">
          {[C_MAJOR_TRIAD, E_MAJOR_TRIAD].map((figure, index) => (
            <div key={index} style={{ width: STAFF_WIDTH, zoom: FIGURE_ZOOM }}>
              <SpelledStaff chords={figure.chords} caption="" bare />
            </div>
          ))}
        </div>
        <div className="text-center">
          <div className="text-7xl font-bold text-gray-900">major chord</div>
          <div className="mt-2 text-4xl text-gray-500">4 + 3 semitones</div>
        </div>
      </div>
    </PromoStage>
  );
}
