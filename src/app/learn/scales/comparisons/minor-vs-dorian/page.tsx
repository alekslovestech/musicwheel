import type { Metadata } from "next";
import { LEARN_STYLES } from "@/lib/design";

import { ScaleDegreeComparison } from "@/components/Learn/figures/ScaleDegreeComparison";
import { ComparisonsBackLink } from "@/components/Learn/layout/ComparisonsBackLink";
import { learnViewMetadata, metadataForSlugPage } from "@/lib/metadata";
import { ScaleModeType } from "@/types/enums/ScaleModeType";
import { ixScaleDegree } from "@/types/ScaleModes/ScaleDegreeType";

export const metadata: Metadata = metadataForSlugPage(
  learnViewMetadata,
  "/learn/scales/comparisons/minor-vs-dorian",
  "Minor vs. Dorian",
  "Two minor scales on the same tonic, separated by a single note - what the sixth degree changes.",
);

export default function MinorVsDorianPage() {
  return (
    <>
      <ComparisonsBackLink />
      <h1 className={LEARN_STYLES.h1}>Minor vs. Dorian</h1>

      <p>
        The first of these is the <i>natural minor scale</i> - <i>Aeolian</i>, in Greek-mode terms -
        and both start on C.
      </p>

      <ScaleDegreeComparison
        modeA={ScaleModeType.Aeolian}
        modeB={ScaleModeType.Dorian}
        degree={ixScaleDegree(6)}
        captionA="C Aeolian holds a flat sixth against the tonic - the darker of the two."
        captionB="C Dorian raises that sixth by a semitone, and the whole scale lifts with it."
      />

      <p>
        That single degree is why <i>Dorian</i> is the brighter minor - it is the scale that keeps a{" "}
        <i>minor third</i> but refuses the <i>minor sixth</i>. Reading it is one thing; the
        difference is much more obvious held under a drone, which is what the links under each
        figure are for.
      </p>
    </>
  );
}
