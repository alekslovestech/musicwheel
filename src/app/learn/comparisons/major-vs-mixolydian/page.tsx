import type { Metadata } from "next";

import { ScaleDegreeComparison } from "@/components/Learn/ScaleDegreeComparison";
import { ComparisonsBackLink } from "@/components/Learn/ComparisonsBackLink";
import { learnViewMetadata, metadataForSlugPage } from "@/lib/metadata";
import { ScaleModeType } from "@/types/enums/ScaleModeType";
import { ixScaleDegree } from "@/types/ScaleModes/ScaleDegreeType";

export const metadata: Metadata = metadataForSlugPage(
  learnViewMetadata,
  "/learn/comparisons/major-vs-mixolydian",
  "Major vs. Mixolydian",
  "The major scale and its closest cousin, separated by a single note - what the flat seventh changes.",
);

export default function MajorVsMixolydianPage() {
  return (
    <>
      <ComparisonsBackLink />
      <h1 className="text-3xl font-semibold">Major vs. Mixolydian: one note apart</h1>

      <p>
        The first of these is the major scale - Ionian, in Greek-mode terms - and both start on C.
        Held against the same tonic, they run identically for the first six degrees, and then they
        disagree exactly once, on the seventh.
      </p>

      <ScaleDegreeComparison
        modeA={ScaleModeType.Ionian}
        modeB={ScaleModeType.Mixolydian}
        degree={ixScaleDegree(7)}
        isClockwise={false}
        captionA="C Ionian holds a natural seventh against the tonic - the brighter of the two."
        captionB="C Mixolydian lowers that seventh by a semitone, into a flat seven."
      />

      <p>
        That single degree is the difference between a leading tone that pulls back to the tonic and
        a flat seventh that doesn&apos;t - the note that gives Mixolydian its bluesy,
        dominant-seventh pull instead of the major scale&apos;s settled resolution. Reading it is
        one thing; the difference is much more obvious held under a drone, which is what the links
        under each figure are for.
      </p>
    </>
  );
}
