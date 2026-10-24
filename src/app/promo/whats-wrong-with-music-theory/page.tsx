import type { Metadata } from "next";

import { SpelledStaff } from "@/components/Learn/figures/SpelledStaff";
import { C_MAJOR_TRIAD_IN_E_MAJOR_OCTAVE1 } from "@/lib/learn/spelledFigures";

/** Source for public/thumbnails/whats-wrong-with-music-theory.png, the link preview image for the article.
 * Not linked from the site. `yarn generate-promo` screenshots this page at 1200x630. */
export const metadata: Metadata = {
  title: "Promo: What's Wrong with Music Theory",
  robots: { index: false, follow: false },
};

/** Magnifies the figure so it fills the 1200x630 frame; link previews get shrunk a lot, so big wins. */
const FIGURE_ZOOM = 6.4;
/** The staff drawing carries more blank space on its left than its right; shift to look centered. */
const NUDGE_LEFT_PX = 55;

export default function WhatsWrongPromoPage() {
  return (
    <main className="flex h-screen w-screen items-center justify-center overflow-hidden bg-white pt-32">
      <div className="w-[12rem] [&_figure]:border-transparent [&_figure]:bg-transparent" style={{ zoom: FIGURE_ZOOM, marginRight: `${NUDGE_LEFT_PX * 2 / FIGURE_ZOOM}px` }}>
        <SpelledStaff
          chords={C_MAJOR_TRIAD_IN_E_MAJOR_OCTAVE1.chords}
          keySignature="E"
          caption=""
        />
      </div>
    </main>
  );
}
