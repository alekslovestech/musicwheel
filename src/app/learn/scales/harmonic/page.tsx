import type { Metadata } from "next";
import Link from "next/link";

import { ScaleFigure } from "@/components/Learn/ScaleFigure";
import { LEARN_STYLES } from "@/lib/design";
import { learnViewMetadata, metadataForSlugPage } from "@/lib/metadata";
import { ScaleModeType } from "@/types/enums/ScaleModeType";

export const metadata: Metadata = metadataForSlugPage(
  learnViewMetadata,
  "/learn/scales/harmonic",
  "What Makes a Scale “Harmonic”?",
  "What the word “harmonic” names across Harmonic Minor, Harmonic Major, Double Harmonic Major, and Double Harmonic Minor (Hungarian Minor) - the leading tone each one adds, and the gaps that come with it.",
);

export default function HarmonicScalesPage() {
  return (
    <>
      <Link href="/learn/scales" className={LEARN_STYLES.link}>
        ← Scales
      </Link>

      <h1 className="text-3xl font-semibold">What Makes a Scale “Harmonic”?</h1>

      <p>
        Four scales carry the word “harmonic” in their name, or in a common name for them. All four
        take a natural scale and move one or two degrees to create a leading tone - a note a
        half-step below the tonic, close enough to pull strongly back into it. That pull is what
        lets a scale support a real dominant chord and a real cadence, which is the “harmonic” the
        name refers to - harmony, in the classical sense of chords resolving to a tonic, not the
        everyday sense of the word.
      </p>

      <ul className="list-disc pl-6">
        <li>
          <Link href="#harmonic-minor" className={LEARN_STYLES.link}>
            Harmonic Minor
          </Link>
        </li>
        <li>
          <Link href="#harmonic-major" className={LEARN_STYLES.link}>
            Harmonic Major
          </Link>
        </li>
        <li>
          <Link href="#double-harmonic-major" className={LEARN_STYLES.link}>
            Double Harmonic Major
          </Link>
        </li>
        <li>
          <Link href="#double-harmonic-minor" className={LEARN_STYLES.link}>
            Double Harmonic Minor (Hungarian Minor)
          </Link>
        </li>
      </ul>

      <h2 id="harmonic-minor" className="text-xl font-semibold">
        Harmonic Minor
      </h2>

      <p>
        The natural minor scale doesn’t have that note. Its seventh degree sits a whole step below
        the tonic, so the chord built on it pulls weakly if at all. Harmonic Minor fixes that by
        raising the seventh a semitone, into a proper leading tone.
      </p>

      <ScaleFigure
        tonic="C"
        scaleMode={ScaleModeType.HarmonicMinor}
        showStepAnnotations
        caption="C Harmonic Minor: every arc is a whole step (W) or half step (H) - except one,
          colored differently, spanning a step and a half."
      />

      <p>
        That colored arc is the cost of the fix: raising one note without moving its neighbor leaves
        a gap between them wider than any other step in the scale - a step and a half, called an
        augmented second. It’s the interval that gives Harmonic Minor its exotic, Middle-Eastern
        edge, and it exists purely as a side effect of adding the leading tone.
      </p>

      <h2 id="harmonic-major" className="text-xl font-semibold">
        Harmonic Major
      </h2>

      <p>
        The major scale doesn’t need the same fix - its seventh degree is already a leading tone.
        Harmonic Major reaches the same combination from the other direction: it lowers the sixth
        instead, so that degree sits the same step-and-a-half below the leading tone that was
        already there.
      </p>

      <ScaleFigure
        tonic="C"
        scaleMode={ScaleModeType.HarmonicMajor}
        showStepAnnotations
        caption="C Harmonic Major: the same colored, step-and-a-half arc as Harmonic Minor, sitting
          one step later in the scale."
      />

      <h2 id="double-harmonic-major" className="text-xl font-semibold">
        Double Harmonic Major
      </h2>

      <p>
        Different degree, same shape: a leading tone directly under the tonic, and an augmented
        second directly under that. Double Harmonic Major does both edits at once - it keeps
        Harmonic Major’s lowered sixth and flattens the second degree as well, opening a second,
        identical gap near the bottom of the scale.
      </p>

      <ScaleFigure
        tonic="C"
        scaleMode={ScaleModeType.DoubleHarmonicMajor}
        showStepAnnotations
        caption="C Double Harmonic Major: two colored, step-and-a-half arcs instead of one, on
          opposite sides of the wheel."
      />

      <p>
        Two augmented seconds instead of one is what gives Double Harmonic Major its especially
        exotic character - the sound behind names like the Byzantine or Arabic scale. Reading about
        the shape is one thing; the links under each figure play the real scale, where both
        stretched gaps are obvious immediately.
      </p>

      <h2 id="double-harmonic-minor" className="text-xl font-semibold">
        Double Harmonic Minor (Hungarian Minor)
      </h2>

      <p>
        Hungarian Minor reaches that same two-gap shape from the minor side. Harmonic Minor already
        has one augmented second, between the sixth and seventh degrees; Hungarian Minor opens a
        second one by raising the fourth degree instead of touching the sixth or seventh again -
        the same doubling Double Harmonic Major does, starting from the other parent scale.
      </p>

      <ScaleFigure
        tonic="C"
        scaleMode={ScaleModeType.HungarianMinor}
        showStepAnnotations
        caption="C Hungarian Minor: two colored, step-and-a-half arcs, same as Double Harmonic Major
          - reached by raising the fourth instead of flattening the second."
      />

      <h2 className="text-xl font-semibold">Comparisons</h2>

      <p>
        For a closer look at exactly one degree separating two of these scales, see{" "}
        <Link
          href="/learn/scales/comparisons/harmonic-minor-vs-harmonic-major"
          className={LEARN_STYLES.link}
        >
          Harmonic Minor vs. Harmonic Major
        </Link>
        ,{" "}
        <Link
          href="/learn/scales/comparisons/harmonic-major-vs-double-harmonic-major"
          className={LEARN_STYLES.link}
        >
          Harmonic Major vs. Double Harmonic Major
        </Link>
        , and{" "}
        <Link
          href="/learn/scales/comparisons/harmonic-minor-vs-hungarian-minor"
          className={LEARN_STYLES.link}
        >
          Harmonic Minor vs. Hungarian Minor
        </Link>
        .
      </p>
    </>
  );
}
