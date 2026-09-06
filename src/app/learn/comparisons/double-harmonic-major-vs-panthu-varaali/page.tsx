import type { Metadata } from "next";

import { ScaleDegreeComparison } from "@/components/Learn/ScaleDegreeComparison";
import { ComparisonsBackLink } from "@/components/Learn/ComparisonsBackLink";
import { learnViewMetadata, metadataForSlugPage } from "@/lib/metadata";
import { ScaleModeType } from "@/types/enums/ScaleModeType";
import { ixScaleDegree } from "@/types/ScaleModes/ScaleDegreeType";

export const metadata: Metadata = metadataForSlugPage(
  learnViewMetadata,
  "/learn/comparisons/double-harmonic-major-vs-panthu-varaali",
  "Double Harmonic Major vs. Panthu Varaali",
  "Two scales on the same tonic, sharing the same flat second and flat sixth - separated by a single note on the fourth degree.",
);

export default function DoubleHarmonicMajorVsPanthuVaraaliPage() {
  return (
    <>
      <ComparisonsBackLink />
      <h1 className="text-3xl font-semibold">
        Double Harmonic Major vs. Panthu Varaali: one note apart
      </h1>

      <p>
        Both of these start on C, and both carry the same pair of flattened notes that give Double
        Harmonic Major its double augmented-second color: a flat second and a flat sixth around a
        major third and seventh. Held against the same tonic, they run identically apart from a
        single degree: the fourth.
      </p>

      <ScaleDegreeComparison
        modeA={ScaleModeType.DoubleHarmonicMajor}
        modeB={ScaleModeType.PanthuVaraali}
        degree={ixScaleDegree(4)}
        captionA="C Double Harmonic Major holds a natural fourth against the tonic - the darker of the two."
        captionB="C Panthu Varaali raises that fourth by a semitone, into a sharp four."
      />

      <p>
        That single degree adds a third tight interval to a scale that already has two: alongside
        the flat-second-to-third gap and the flat-sixth-to-seventh gap, Panthu Varaali opens a third
        one between the raised fourth and the fifth. Reading it is one thing; the difference is much
        more obvious held under a drone, which is what the links under each figure are for.
      </p>
    </>
  );
}
