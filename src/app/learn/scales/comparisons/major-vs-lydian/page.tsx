import type { Metadata } from "next";
import { LEARN_STYLES } from "@/lib/design";

import { ScaleDegreeComparison } from "@/components/Learn/figures/ScaleDegreeComparison";
import { ComparisonsBackLink } from "@/components/Learn/layout/ComparisonsBackLink";
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
      <h1 className={LEARN_STYLES.h1}>Major vs. Lydian</h1>

      <p>
        The first of these is the <i>major scale</i> - <i>Ionian</i>, in Greek-mode terms - and both
        start on C.
      </p>

      <ScaleDegreeComparison
        modeA={ScaleModeType.Ionian}
        modeB={ScaleModeType.Lydian}
        degree={ixScaleDegree(4)}
        captionA="C Ionian holds a natural fourth against the tonic - the darker of the two."
        captionB="C Lydian raises that fourth by a semitone, into a sharp four."
      />

      <p>
        That single degree is why <i>Lydian</i> is called the brighter major - raising the fourth
        removes the only note in the <i>major scale</i> that leans toward the tonic from above,
        leaving a scale that floats rather than resolves. Reading it is one thing; the difference is
        much more obvious held under a drone, which is what the links under each figure are for.
      </p>
    </>
  );
}
