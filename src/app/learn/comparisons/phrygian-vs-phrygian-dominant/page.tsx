import type { Metadata } from "next";

import { ScaleDegreeComparison } from "@/components/Learn/ScaleDegreeComparison";
import { ComparisonsBackLink } from "@/components/Learn/ComparisonsBackLink";
import { learnViewMetadata, metadataForSlugPage } from "@/lib/metadata";
import { ScaleModeType } from "@/types/enums/ScaleModeType";
import { ixScaleDegree } from "@/types/ScaleModes/ScaleDegreeType";

export const metadata: Metadata = metadataForSlugPage(
  learnViewMetadata,
  "/learn/comparisons/phrygian-vs-phrygian-dominant",
  "Phrygian vs. Phrygian Dominant",
  "Two scales on the same tonic, sharing the same flat second - separated by a single note on the third degree.",
);

export default function PhrygianVsPhrygianDominantPage() {
  return (
    <>
      <ComparisonsBackLink />
      <h1 className="text-3xl font-semibold">Phrygian vs. Phrygian Dominant: one note apart</h1>

      <p>
        Both of these start on C, and both hold the flat second that gives Phrygian its
        unmistakable, unsettled sound - the half-step down from the tonic that no other minor mode
        has. Against that same tonic, they run identically for the first two degrees, and then they
        disagree exactly once, on the third.
      </p>

      <ScaleDegreeComparison
        modeA={ScaleModeType.Phrygian}
        modeB={ScaleModeType.PhrygianDominant}
        degree={ixScaleDegree(3)}
        captionA="C Phrygian holds a flat third against the tonic - the darker of the two."
        captionB="C Phrygian Dominant raises that third by a semitone, into major."
      />

      <p>
        That single degree is the whole difference between a minor mode and what is really a major
        third sitting one half-step above a flat second - the gap listeners hear as “exotic,” and
        the reason Phrygian Dominant turns up under names like the Spanish or Gypsy scale. Reading
        the two side by side is one thing; the difference is much more obvious held under a drone,
        which is what the links under each figure are for.
      </p>
    </>
  );
}
