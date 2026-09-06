import type { Metadata } from "next";
import Link from "next/link";

import { SingleScaleFigure } from "@/components/Learn/SingleScaleFigure";
import { LEARN_STYLES } from "@/lib/design";
import { learnViewMetadata, metadataForSlugPage } from "@/lib/metadata";
import { ScaleModeType } from "@/types/enums/ScaleModeType";

export const metadata: Metadata = metadataForSlugPage(
  learnViewMetadata,
  "/learn/harmonic-scales",
  "What Makes a Scale “Harmonic”?",
  "What the word “harmonic” names across Harmonic Minor, Harmonic Major, and Double Harmonic Major - the leading tone each one adds, and the gaps that come with it.",
);

export default function HarmonicScalesPage() {
  return (
    <>
      <Link href="/learn" className={LEARN_STYLES.link}>
        ← Learn
      </Link>

      <h1 className="text-3xl font-semibold">What Makes a Scale “Harmonic”?</h1>

      <p>
        Three scales carry the word “harmonic” in their name: Harmonic Minor, Harmonic Major, and
        Double Harmonic Major. All three take a natural scale and move one or two degrees to create
        a leading tone - a note a half-step below the tonic, close enough to pull strongly back into
        it. That pull is what lets a scale support a real dominant chord and a real cadence, which
        is the “harmonic” the name refers to - harmony, in the classical sense of chords resolving
        to a tonic, not the everyday sense of the word.
      </p>

      <p>
        The natural minor scale doesn’t have that note. Its seventh degree sits a whole step below
        the tonic, so the chord built on it pulls weakly if at all. Harmonic Minor fixes that by
        raising the seventh a semitone, into a proper leading tone.
      </p>

      <SingleScaleFigure
        tonic="C"
        scaleMode={ScaleModeType.HarmonicMinor}
        caption="C Harmonic Minor: every arc is a whole step (W) or half step (H) - except one,
          colored differently, spanning a step and a half."
      />

      <p>
        That colored arc is the cost of the fix: raising one note without moving its neighbor leaves
        a gap between them wider than any other step in the scale - a step and a half, called an
        augmented second. It’s the interval that gives Harmonic Minor its exotic, Middle-Eastern
        edge, and it exists purely as a side effect of adding the leading tone.
      </p>

      <p>
        The major scale doesn’t need the same fix - its seventh degree is already a leading tone.
        Harmonic Major reaches the same combination from the other direction: it lowers the sixth
        instead, so that degree sits the same step-and-a-half below the leading tone that was
        already there.
      </p>

      <SingleScaleFigure
        tonic="C"
        scaleMode={ScaleModeType.HarmonicMajor}
        caption="C Harmonic Major: the same colored, step-and-a-half arc as Harmonic Minor, sitting
          one step later in the scale."
      />

      <p>
        Different degree, same shape: a leading tone directly under the tonic, and an augmented
        second directly under that. Double Harmonic Major does both edits at once - it keeps
        Harmonic Major’s lowered sixth and flattens the second degree as well, opening a second,
        identical gap near the bottom of the scale.
      </p>

      <SingleScaleFigure
        tonic="C"
        scaleMode={ScaleModeType.DoubleHarmonicMajor}
        caption="C Double Harmonic Major: two colored, step-and-a-half arcs instead of one, on
          opposite sides of the wheel."
      />

      <p>
        Two augmented seconds instead of one is what gives Double Harmonic Major its especially
        exotic character - the sound behind names like the Byzantine or Arabic scale. Reading about
        the shape is one thing; the links under each figure play the real scale, where both
        stretched gaps are obvious immediately. For a closer look at exactly what separates it from
        its parent scale, see{" "}
        <Link
          href="/learn/comparisons/harmonic-major-vs-double-harmonic-major"
          className={LEARN_STYLES.link}
        >
          Harmonic Major vs. Double Harmonic Major
        </Link>
        .
      </p>
    </>
  );
}
