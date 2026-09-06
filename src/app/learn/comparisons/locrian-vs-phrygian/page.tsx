import type { Metadata } from "next";

import { ScaleDegreeComparison } from "@/components/Learn/ScaleDegreeComparison";
import { ComparisonsBackLink } from "@/components/Learn/ComparisonsBackLink";
import { learnViewMetadata, metadataForSlugPage } from "@/lib/metadata";
import { ScaleModeType } from "@/types/enums/ScaleModeType";
import { ixScaleDegree } from "@/types/ScaleModes/ScaleDegreeType";

export const metadata: Metadata = metadataForSlugPage(
  learnViewMetadata,
  "/learn/comparisons/locrian-vs-phrygian",
  "Locrian vs. Phrygian",
  "Two minor scales on the same tonic, sharing the same flat second - separated by a single note on the fifth degree.",
);

export default function LocrianVsPhrygianPage() {
  return (
    <>
      <ComparisonsBackLink />
      <h1 className="text-3xl font-semibold">Locrian vs. Phrygian: one note apart</h1>

      <p>
        Both of these start on C, and both hold the flat second that makes a scale sound unsettled
        right from its first step off the tonic. Held against the same tonic, they run identically
        apart from a single degree: the fifth.
      </p>

      <ScaleDegreeComparison
        modeA={ScaleModeType.Locrian}
        modeB={ScaleModeType.Phrygian}
        degree={ixScaleDegree(5)}
        captionA="C Locrian holds a flat fifth against the tonic - the darker of the two."
        captionB="C Phrygian raises that fifth by a semitone, into a stable perfect fifth."
      />

      <p>
        That single degree is the difference between a scale that can support a stable tonic chord
        and one that can&apos;t: Locrian&apos;s flat fifth makes its own tonic triad diminished, the
        only common mode where that&apos;s true, while Phrygian&apos;s perfect fifth gives it an
        ordinary minor tonic underneath the same unsettled second. Reading it is one thing; the
        difference is much more obvious held under a drone, which is what the links under each
        figure are for.
      </p>
    </>
  );
}
