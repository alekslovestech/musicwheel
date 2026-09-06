import type { Metadata } from "next";

import { ScaleDegreeComparison } from "@/components/Learn/ScaleDegreeComparison";
import { ComparisonsBackLink } from "@/components/Learn/ComparisonsBackLink";
import { learnViewMetadata, metadataForSlugPage } from "@/lib/metadata";
import { ScaleModeType } from "@/types/enums/ScaleModeType";
import { ixScaleDegree } from "@/types/ScaleModes/ScaleDegreeType";

export const metadata: Metadata = metadataForSlugPage(
  learnViewMetadata,
  "/learn/comparisons/minor-vs-harmonic-minor",
  "Minor vs. Harmonic Minor",
  "The natural minor scale and its raised-seventh cousin, separated by a single note - what the leading tone changes.",
);

export default function MinorVsHarmonicMinorPage() {
  return (
    <>
      <ComparisonsBackLink />
      <h1 className="text-3xl font-semibold">Minor vs. Harmonic Minor: one note apart</h1>

      <p>
        Both of these start on C, and both are minor scales in every way that matters for the first
        six degrees. Held against the same tonic, they run identically until the seventh, where they
        disagree exactly once.
      </p>

      <ScaleDegreeComparison
        modeA={ScaleModeType.Aeolian}
        modeB={ScaleModeType.HarmonicMinor}
        degree={ixScaleDegree(7)}
        captionA="C Minor holds a flat seventh against the tonic - the darker of the two."
        captionB="C Harmonic Minor raises that seventh by a semitone, into a leading tone."
      />

      <p>
        That single degree is what gives Harmonic Minor its name and its pull: a natural minor has
        no note that leans back into the tonic, but raising the seventh creates one, at the cost of
        stretching the gap behind it into the wide, exotic step between the sixth and seventh.
        Reading it is one thing; the difference is much more obvious held under a drone, which is
        what the links under each figure are for.
      </p>
    </>
  );
}
