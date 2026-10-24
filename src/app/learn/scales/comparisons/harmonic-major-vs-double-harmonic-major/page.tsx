import type { Metadata } from "next";
import { LEARN_STYLES } from "@/lib/design";

import { ScaleDegreeComparison } from "@/components/Learn/figures/ScaleDegreeComparison";
import { ComparisonsBackLink } from "@/components/Learn/layout/ComparisonsBackLink";
import { learnViewMetadata, metadataForSlugPage } from "@/lib/metadata";
import { ScaleModeType } from "@/types/enums/ScaleModeType";
import { ixScaleDegree } from "@/types/ScaleModes/ScaleDegreeType";

export const metadata: Metadata = metadataForSlugPage(
  learnViewMetadata,
  "/learn/scales/comparisons/harmonic-major-vs-double-harmonic-major",
  "Harmonic Major vs. Double Harmonic Major",
  "Two scales on the same tonic, sharing the same flat sixth - separated by a single note on the second degree.",
);

export default function HarmonicMajorVsDoubleHarmonicMajorPage() {
  return (
    <>
      <ComparisonsBackLink />
      <h1 className={LEARN_STYLES.h1}>Harmonic Major vs. Double Harmonic Major</h1>

      <p>
        Both of these start on C, and both hold the flat sixth that gives <i>Harmonic Major</i> its
        name - a <i>major scale</i> with one note pulled toward minor.
      </p>

      <ScaleDegreeComparison
        modeA={ScaleModeType.HarmonicMajor}
        modeB={ScaleModeType.DoubleHarmonicMajor}
        degree={ixScaleDegree(2)}
        isClockwise={false}
        captionA="C Harmonic Major holds a natural second against the tonic - the brighter of the two."
        captionB="C Double Harmonic Major lowers that second by a semitone, into a flat two."
      />

      <p>
        That single degree is what turns one flattened note into two: <i>Double Harmonic Major</i>{" "}
        pairs the flat second against the <i>major third</i> right above it, the same tight,{" "}
        <i>augmented-second</i> gap that gives <i>Phrygian Dominant</i> its exotic color - only here
        it shows up twice, once low in the scale and once again between the flat sixth and the{" "}
        <i>major seventh</i>. Reading it is one thing; the difference is much more obvious held
        under a drone, which is what the links under each figure are for.
      </p>
    </>
  );
}
