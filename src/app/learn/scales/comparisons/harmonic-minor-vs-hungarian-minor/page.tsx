import type { Metadata } from "next";

import { ScaleDegreeComparison } from "@/components/Learn/ScaleDegreeComparison";
import { ComparisonsBackLink } from "@/components/Learn/ComparisonsBackLink";
import { learnViewMetadata, metadataForSlugPage } from "@/lib/metadata";
import { ScaleModeType } from "@/types/enums/ScaleModeType";
import { ixScaleDegree } from "@/types/ScaleModes/ScaleDegreeType";

export const metadata: Metadata = metadataForSlugPage(
  learnViewMetadata,
  "/learn/scales/comparisons/harmonic-minor-vs-hungarian-minor",
  "Harmonic Minor vs. Hungarian Minor",
  "Two minor scales on the same tonic, sharing the same leading tone - separated by a single note on the fourth degree.",
);

export default function HarmonicMinorVsHungarianMinorPage() {
  return (
    <>
      <ComparisonsBackLink />
      <h1 className="text-3xl font-semibold">Harmonic Minor vs. Hungarian Minor</h1>

      <p>
        Both of these start on C, and both keep the raised seventh that gives Harmonic Minor its
        pull back to the tonic.
      </p>

      <ScaleDegreeComparison
        modeA={ScaleModeType.HarmonicMinor}
        modeB={ScaleModeType.HungarianMinor}
        degree={ixScaleDegree(4)}
        captionA="C Harmonic Minor holds a natural fourth against the tonic - the darker of the two."
        captionB="C Hungarian Minor raises that fourth by a semitone, into a sharp four."
      />

      <p>
        That single degree adds a second stretched, augmented-second gap to a scale that already has
        one: alongside the wide step between the flat sixth and the leading tone, Hungarian Minor
        opens a matching one between the raised fourth and the fifth, which is what gives it its
        dramatic, folk-tinged color. Reading it is one thing; the difference is much more obvious
        held under a drone, which is what the links under each figure are for.
      </p>
    </>
  );
}
