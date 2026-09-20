import type { Metadata } from "next";
import Link from "next/link";

import { ComparisonGrid2 } from "@/components/Learn/ComparisonGrid";
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

      <h1 className={LEARN_STYLES.h1}>What Makes a Scale “Harmonic”?</h1>

      <p>
        Four scales carry the word “harmonic” in their name. Each has at least one interval of 3
        semitones between neighboring degrees (also known as an <i>augmented 2nd</i> or a{" "}
        <i>minor 3rd</i>), colored yellow on the wheel. That interval doesn’t appear in any of the{" "}
        <Link href="/learn/scales/greek-modes" className={LEARN_STYLES.link}>
          Greek modes
        </Link>
        .
      </p>

      <h2 id="harmonic-minor-major" className={LEARN_STYLES.h2}>
        Harmonic Minor and Harmonic Major
      </h2>

      <p>
        Both scales contain an <i>augmented 2nd</i> interval between ♭6 and 7 - labeled{" "}
        <i>1½</i> on the ribbon below.
      </p>

      <ComparisonGrid2>
        <ScaleFigure
          tonic="C"
          scaleType={ScaleModeType.HarmonicMinor}
          showStepAnnotations
          caption="C Harmonic Minor: the ♭6 and 7, an augmented 2nd apart."
          isCompact
          showRibbon
        />
        <ScaleFigure
          tonic="C"
          scaleType={ScaleModeType.HarmonicMajor}
          showStepAnnotations
          caption="C Harmonic Major: the same ♭6 and 7, an augmented 2nd apart."
          isCompact
          showRibbon
        />
      </ComparisonGrid2>

      <h2 id="double-harmonic" className={LEARN_STYLES.h2}>
        Double Harmonic Major and Double Harmonic Minor (Hungarian Minor)
      </h2>

      <p>
        Both of the Double Harmonic scales carry two of these <i>augmented 2nd</i> intervals instead of one: the ♭6-to-7 gap, plus
        a second, identical interval elsewhere - between ♭2 and 3 in Double Harmonic Major, between ♭3 and
        ♯4 in Hungarian Minor.
      </p>

      <ComparisonGrid2>
        <ScaleFigure
          tonic="C"
          scaleType={ScaleModeType.DoubleHarmonicMajor}
          showStepAnnotations
          caption="C Double Harmonic Major: two augmented 2nd intervals, on opposite sides of the wheel."
          isCompact
          showRibbon
        />
        <ScaleFigure
          tonic="C"
          scaleType={ScaleModeType.HungarianMinor}
          showStepAnnotations
          caption="C Hungarian Minor: the same two-interval shape, but starting from a different tonic."
          isCompact
          showRibbon
        />
      </ComparisonGrid2>

      <h2 className={LEARN_STYLES.h2}>Comparisons</h2>

      <p>For a closer look at pairs of harmonic scales, see:</p>

      <ul className="list-disc pl-6">
        <li>
          <Link
            href="/learn/scales/comparisons/harmonic-minor-vs-harmonic-major"
            className={LEARN_STYLES.link}
          >
            Harmonic Minor vs. Harmonic Major
          </Link>
        </li>
        <li>
          <Link
            href="/learn/scales/comparisons/harmonic-major-vs-double-harmonic-major"
            className={LEARN_STYLES.link}
          >
            Harmonic Major vs. Double Harmonic Major
          </Link>
        </li>
        <li>
          <Link
            href="/learn/scales/comparisons/harmonic-minor-vs-hungarian-minor"
            className={LEARN_STYLES.link}
          >
            Harmonic Minor vs. Hungarian Minor
          </Link>
        </li>
      </ul>
    </>
  );
}
