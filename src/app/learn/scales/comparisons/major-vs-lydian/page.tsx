import type { Metadata } from "next";

import { ScaleDegreeComparison } from "@/components/Learn/ScaleDegreeComparison";
import { ComparisonsBackLink } from "@/components/Learn/ComparisonsBackLink";
import { learnViewMetadata, metadataForSlugPage } from "@/lib/metadata";
import { ScaleModeType } from "@/types/enums/ScaleModeType";
import { ixScaleDegree } from "@/types/ScaleModes/ScaleDegreeType";

export const metadata: Metadata = metadataForSlugPage(
  learnViewMetadata,
  "/learn/scales/comparisons/major-vs-lydian",
  "Major vs. Lydian",
  "The major scale and its brighter cousin, separated by a single note - what the sharp fourth changes.",
);

export default function MajorVsLydianPage() {
  return (
    <>
      <ComparisonsBackLink />
      <h1 className="text-3xl font-semibold">Major vs. Lydian</h1>

      <p>
        The first of these is the major scale - Ionian, in Greek-mode terms - and both start on C.
      </p>

      <ScaleDegreeComparison
        modeA={ScaleModeType.Ionian}
        modeB={ScaleModeType.Lydian}
        degree={ixScaleDegree(4)}
        captionA="C Ionian holds a natural fourth against the tonic - the darker of the two."
        captionB="C Lydian raises that fourth by a semitone, into a sharp four."
      />

      <p>
        That single degree is why Lydian is called the brighter major - raising the fourth removes
        the only note in the major scale that leans toward the tonic from above, leaving a scale
        that floats rather than resolves. Reading it is one thing; the difference is much more
        obvious held under a drone, which is what the links under each figure are for.
      </p>
    </>
  );
}
