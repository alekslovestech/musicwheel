import type { Metadata } from "next";

import { ScaleDegreeComparison } from "@/components/Learn/ScaleDegreeComparison";
import { ComparisonsBackLink } from "@/components/Learn/ComparisonsBackLink";
import { learnViewMetadata, metadataForSlugPage } from "@/lib/metadata";
import { ScaleModeType } from "@/types/enums/ScaleModeType";
import { ixScaleDegree } from "@/types/ScaleModes/ScaleDegreeType";

export const metadata: Metadata = metadataForSlugPage(
  learnViewMetadata,
  "/learn/comparisons/harmonic-minor-vs-melodic-minor",
  "Harmonic Minor vs. Melodic Minor",
  "Two minor scales on the same tonic, sharing the same major seventh - separated by a single note on the sixth degree.",
);

export default function HarmonicMinorVsMelodicMinorPage() {
  return (
    <>
      <ComparisonsBackLink />
      <h1 className="text-3xl font-semibold">Harmonic Minor vs. Melodic Minor</h1>

      <p>
        Both of these start on C, and both keep the raised seventh that a plain natural minor
        doesn&apos;t have - the leading tone that pulls back to the tonic.
      </p>

      <ScaleDegreeComparison
        modeA={ScaleModeType.HarmonicMinor}
        modeB={ScaleModeType.MelodicMinor}
        degree={ixScaleDegree(6)}
        captionA="C Harmonic Minor holds a flat sixth against the tonic - the darker of the two."
        captionB="C Melodic Minor raises that sixth by a semitone, smoothing the scale out."
      />

      <p>
        That single degree is the whole reason Harmonic Minor has its stretched, almost
        Middle-Eastern gap between the sixth and seventh - a step and a half that no other common
        scale leaves open. Melodic Minor closes it by raising the sixth, trading that exotic leap
        for a scale that runs smoothly in both directions, which is the whole point of its name.
        Reading it is one thing; the difference is much more obvious held under a drone, which is
        what the links under each figure are for.
      </p>
    </>
  );
}
