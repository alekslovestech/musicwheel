import type { Metadata } from "next";
import { LEARN_STYLES } from "@/lib/design";

import { ScaleDegreeComparison } from "@/components/Learn/ScaleDegreeComparison";
import { ComparisonsBackLink } from "@/components/Learn/ComparisonsBackLink";
import { learnViewMetadata, metadataForSlugPage } from "@/lib/metadata";
import { ScaleModeType } from "@/types/enums/ScaleModeType";
import { ixScaleDegree } from "@/types/ScaleModes/ScaleDegreeType";

export const metadata: Metadata = metadataForSlugPage(
  learnViewMetadata,
  "/learn/scales/comparisons/major-vs-melodic-minor",
  "Major vs. Melodic Minor",
  "The major scale and melodic minor, separated by a single note - the third degree, and nothing else.",
);

export default function MajorVsMelodicMinorPage() {
  return (
    <>
      <ComparisonsBackLink />
      <h1 className={LEARN_STYLES.h1}>Major vs. Melodic Minor</h1>

      <p>
        Both of these start on C, and if you only look at the third, they cover the entire distance
        between major and minor in a single note.
      </p>

      <ScaleDegreeComparison
        modeA={ScaleModeType.Ionian}
        modeB={ScaleModeType.MelodicMinor}
        degree={ixScaleDegree(3)}
        isClockwise={false}
        captionA="C Major holds a natural third against the tonic - the brighter of the two."
        captionB="C Melodic Minor lowers that third by a semitone, into a minor third."
      />

      <p>
        That single note is the cleanest way to describe <i>Melodic Minor</i> there is - not the{" "}
        <i>natural minor scale</i> with two degrees raised, but the <i>major scale</i> with exactly
        one degree lowered. Every other minor color a scale can have - the flat sixth of{" "}
        <i>harmonic minor</i>, the flat seventh of <i>natural minor</i> - is simply absent here;{" "}
        <i>Melodic Minor</i> keeps the <i>major scale</i>&apos;s brighter upper half intact and
        touches only the third. Reading it is one thing; the difference is much more obvious held
        under a drone, which is what the links under each figure are for.
      </p>
    </>
  );
}
