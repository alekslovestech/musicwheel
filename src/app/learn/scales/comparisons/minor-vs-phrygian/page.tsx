import type { Metadata } from "next";

import { ScaleDegreeComparison } from "@/components/Learn/ScaleDegreeComparison";
import { ComparisonsBackLink } from "@/components/Learn/ComparisonsBackLink";
import { learnViewMetadata, metadataForSlugPage } from "@/lib/metadata";
import { ScaleModeType } from "@/types/enums/ScaleModeType";
import { ixScaleDegree } from "@/types/ScaleModes/ScaleDegreeType";

export const metadata: Metadata = metadataForSlugPage(
  learnViewMetadata,
  "/learn/scales/comparisons/minor-vs-phrygian",
  "Minor vs. Phrygian",
  "Two minor scales on the same tonic, separated by a single note - what the flat second changes.",
);

export default function MinorVsPhrygianPage() {
  return (
    <>
      <ComparisonsBackLink />
      <h1 className="text-3xl font-semibold">Minor vs. Phrygian</h1>

      <p>
        The first of these is the natural minor scale - Aeolian, in Greek-mode terms - and both
        start on C.
      </p>

      <ScaleDegreeComparison
        modeA={ScaleModeType.Aeolian}
        modeB={ScaleModeType.Phrygian}
        degree={ixScaleDegree(2)}
        isClockwise={false}
        captionA="C Aeolian holds a natural second against the tonic - the brighter of the two."
        captionB="C Phrygian lowers that second by a semitone, into a flat two."
      />

      <p>
        That single degree is the whole reason Phrygian sounds unsettled where the natural minor
        sounds merely sad: a half-step down from the tonic is the tightest interval a scale can open
        right at its root, and no other common minor mode has it. Reading it is one thing; the
        difference is much more obvious held under a drone, which is what the links under each
        figure are for.
      </p>
    </>
  );
}
