import type { Metadata } from "next";
import Link from "next/link";

import { ScaleFigure } from "@/components/Learn/ScaleFigure";
import { LEARN_STYLES } from "@/lib/design";
import { learnViewMetadata, metadataForSlugPage } from "@/lib/metadata";
import { ScaleModeType } from "@/types/enums/ScaleModeType";

export const metadata: Metadata = metadataForSlugPage(
  learnViewMetadata,
  "/learn/scales/melodic-minor-modes",
  "Modes of Melodic Minor",
  "Melodic Minor's rotation family, mostly known through jazz - the three most commonly used modes and the chords they're played against.",
);

export default function MelodicMinorModesPage() {
  return (
    <>
      <Link href="/learn/scales/modal-rotations" className={LEARN_STYLES.link}>
        ← Modal Families Beyond the Major Scale
      </Link>

      <h1 className="text-3xl font-semibold">Modes of Melodic Minor</h1>

      <p>
        Melodic Minor has the most famous rotation family outside the major scale, mostly through
        jazz, where each of its seven modes has its own name and its own standard use against a
        specific chord type. Of the seven modes, three come up most often in practice - the rest
        aren&apos;t in the app yet, so this page sticks to those three.
      </p>

      <p>
        <strong>Melodic Minor</strong> (mode 1) - 1 2 ♭3 4 5 6 7. The parent scale: a minor scale
        with both the 6th and 7th degrees raised, closing the gap Harmonic Minor leaves open.
      </p>

      <ScaleFigure
        tonic="C"
        scaleMode={ScaleModeType.MelodicMinor}
        showStepAnnotations
        caption="C Melodic Minor."
      />

      <p>
        <strong>Lydian Dominant</strong>, also called the Overtone scale (mode 4) - 1 2 3 ♯4 5 6 ♭7.
        A dominant 7th chord&apos;s scale with Lydian&apos;s raised 4th instead of Mixolydian&apos;s
        natural one; commonly played over a dominant 7♯11 chord.
      </p>

      <ScaleFigure
        tonic="F"
        scaleMode={ScaleModeType.LydianDominant}
        showStepAnnotations
        caption="F Lydian Dominant: the same seven notes as C Melodic Minor, started on the 4th
          degree instead of the 1st."
      />

      <p>
        <strong>Super Locrian</strong>, also called the Altered scale (mode 7) - 1 ♭2 ♯2 3 ♭5 ♯5 ♭7.
        Every alterable degree of a dominant chord flattened or sharpened at once; the standard
        scale for an altered dominant chord, and the most commonly cited of all seven modes.
      </p>

      <ScaleFigure
        tonic="B"
        scaleMode={ScaleModeType.SuperLocrian}
        showStepAnnotations
        caption="B Super Locrian: the same seven notes as C Melodic Minor, started on the 7th
          degree - the leading tone - instead of the 1st."
      />
    </>
  );
}
