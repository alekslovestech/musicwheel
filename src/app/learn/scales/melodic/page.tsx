import type { Metadata } from "next";
import Link from "next/link";

import { SingleScaleFigure } from "@/components/Learn/SingleScaleFigure";
import { LEARN_STYLES } from "@/lib/design";
import { learnViewMetadata, metadataForSlugPage } from "@/lib/metadata";
import { ScaleModeType } from "@/types/enums/ScaleModeType";

export const metadata: Metadata = metadataForSlugPage(
  learnViewMetadata,
  "/learn/scales/melodic",
  "What Makes a Scale “Melodic”?",
  "What the word “melodic” names in Melodic Minor - the awkward gap it closes, and the tradeoff that costs.",
);

export default function MelodicScalesPage() {
  return (
    <>
      <Link href="/learn/scales" className={LEARN_STYLES.link}>
        ← Scales
      </Link>

      <h1 className="text-3xl font-semibold">What Makes a Scale “Melodic”?</h1>

      <p>
        “Melodic” names the opposite kind of edit from “harmonic.” A{" "}
        <Link href="/learn/scales/harmonic" className={LEARN_STYLES.link}>
          harmonic scale
        </Link>{" "}
        moves a degree to create a leading tone, for the sake of chords and cadences, and accepts an
        awkward, stretched gap as the cost. A melodic scale takes that same leading tone and smooths
        the gap back out, for the sake of a line that&apos;s easier to sing or play in one direction
        - at the cost of some of the harmonic scale&apos;s exotic color. In this app, that&apos;s
        Melodic Minor.
      </p>

      <p>
        Harmonic Minor gets its leading tone by raising the seventh degree, which leaves a step and
        a half open between the sixth and seventh - the tightest gap a common scale can have, and an
        awkward one to move through smoothly. Melodic Minor keeps that leading tone but raises the
        sixth as well, closing the gap completely.
      </p>

      <SingleScaleFigure
        tonic="C"
        scaleMode={ScaleModeType.MelodicMinor}
        caption="C Melodic Minor: no colored arc anywhere - every step is a plain whole step (W) or
          half step (H)."
      />

      <p>
        That&apos;s the whole difference from Harmonic Minor: one more degree raised, one gap
        closed. Classically, the fix was only meant for going up - melodic minor traditionally
        relaxes back to the plain natural minor on the way down, since a descending line is moving
        away from the tonic and doesn&apos;t need the leading tone&apos;s pull. This app, like most
        instrumental and jazz use of the scale, treats it as one fixed seven-note scale rather than
        switching shape by direction.
      </p>

      <p>
        So the tradeoff runs in one direction: harmonic scales keep the exotic augmented second and
        the strong pull to the tonic; melodic scales give up some of that color for a scale that
        moves evenly. For the raised sixth and seventh side by side against the scales they come
        from, see{" "}
        <Link
          href="/learn/scales/comparisons/minor-vs-harmonic-minor"
          className={LEARN_STYLES.link}
        >
          Minor vs. Harmonic Minor
        </Link>{" "}
        and{" "}
        <Link
          href="/learn/scales/comparisons/harmonic-minor-vs-melodic-minor"
          className={LEARN_STYLES.link}
        >
          Harmonic Minor vs. Melodic Minor
        </Link>
        .
      </p>
    </>
  );
}
