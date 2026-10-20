import type { Metadata } from "next";

import { StaticStaffFigure } from "@/components/Learn/StaticStaffFigure";
import { C_MAJOR_TRIAD_IN_E_MAJOR_OCTAVE1 } from "@/lib/learn/staffFigures";

/** Source for public/whats-wrong-with-music-theory.png, the link preview image for the article.
 * Not linked from the site. `yarn generate-promo` screenshots this page at 1200x630. */
export const metadata: Metadata = {
  title: "Promo: What's Wrong with Music Theory",
  robots: { index: false, follow: false },
};

/** Magnifies the figure so it fills the 1200x630 frame; link previews get shrunk a lot, so big wins. */
const FIGURE_ZOOM = 4.4;

export default function WhatsWrongPromoPage() {
  return (
    <main className="flex h-screen w-screen items-center justify-center overflow-hidden bg-canvas-bgScales pt-20">
      <div className="w-[12rem] [&_figure]:border-transparent" style={{ zoom: FIGURE_ZOOM }}>
        <StaticStaffFigure
          chords={C_MAJOR_TRIAD_IN_E_MAJOR_OCTAVE1.chords}
          keySignature="E"
          caption=""
        />
      </div>
    </main>
  );
}
