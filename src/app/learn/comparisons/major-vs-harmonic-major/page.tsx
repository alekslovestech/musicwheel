import type { Metadata } from "next";

import { ScaleDegreeComparison } from "@/components/Learn/ScaleDegreeComparison";
import { ComparisonsBackLink } from "@/components/Learn/ComparisonsBackLink";
import { learnViewMetadata, metadataForSlugPage } from "@/lib/metadata";
import { ScaleModeType } from "@/types/enums/ScaleModeType";
import { ixScaleDegree } from "@/types/ScaleModes/ScaleDegreeType";

export const metadata: Metadata = metadataForSlugPage(
  learnViewMetadata,
  "/learn/comparisons/major-vs-harmonic-major",
  "Major vs. Harmonic Major",
  "The major scale and its flat-sixth cousin, separated by a single note - what the sixth degree changes.",
);

export default function MajorVsHarmonicMajorPage() {
  return (
    <>
      <ComparisonsBackLink />
      <h1 className="text-3xl font-semibold">Major vs. Harmonic Major</h1>

      <p>Both of these start on C, and both are major scales.</p>

      <ScaleDegreeComparison
        modeA={ScaleModeType.Ionian}
        modeB={ScaleModeType.HarmonicMajor}
        degree={ixScaleDegree(6)}
        isClockwise={false}
        captionA="C Major holds a natural sixth against the tonic - the brighter of the two."
        captionB="C Harmonic Major lowers that sixth by a semitone, into a flat six."
      />

      <p>
        That single degree is what pulls a major scale toward minor without touching its third:
        Harmonic Major keeps the bright major third and seventh, but the flattened sixth opens the
        same augmented-second gap - the stretched, exotic step - that Harmonic Minor gets from the
        opposite direction. Reading it is one thing; the difference is much more obvious held under
        a drone, which is what the links under each figure are for.
      </p>
    </>
  );
}
