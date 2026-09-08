import type { Metadata } from "next";
import Link from "next/link";

import { ScaleDegreeComparison } from "@/components/Learn/ScaleDegreeComparison";
import { ComparisonsBackLink } from "@/components/Learn/ComparisonsBackLink";
import { LEARN_STYLES } from "@/lib/design";
import { learnViewMetadata, metadataForSlugPage } from "@/lib/metadata";
import { ScaleModeType } from "@/types/enums/ScaleModeType";
import { ixScaleDegree } from "@/types/ScaleModes/ScaleDegreeType";

export const metadata: Metadata = metadataForSlugPage(
  learnViewMetadata,
  "/learn/scales/comparisons/harmonic-minor-vs-harmonic-major",
  "Harmonic Minor vs. Harmonic Major",
  "Two already-altered scales, separated by a single note - what the third degree changes once the sixth and seventh are already fixed.",
);

export default function HarmonicMinorVsHarmonicMajorPage() {
  return (
    <>
      <ComparisonsBackLink />
      <h1 className="text-3xl font-semibold">Harmonic Minor vs. Harmonic Major</h1>

      <p>
        Both of these start on C, and both already carry a flat sixth and a raised seventh - the
        same augmented-second gap between them, reached from opposite directions (see{" "}
        <Link href="/learn/scales/comparisons/minor-vs-harmonic-minor" className={LEARN_STYLES.link}>
          Minor vs. Harmonic Minor
        </Link>{" "}
        and{" "}
        <Link href="/learn/scales/comparisons/major-vs-harmonic-major" className={LEARN_STYLES.link}>
          Major vs. Harmonic Major
        </Link>
        ). The only thing left to separate them is the third.
      </p>

      <ScaleDegreeComparison
        modeA={ScaleModeType.HarmonicMinor}
        modeB={ScaleModeType.HarmonicMajor}
        degree={ixScaleDegree(3)}
        captionA="C Harmonic Minor holds a flat third against the tonic - the darker of the two."
        captionB="C Harmonic Major raises that third by a semitone, into a natural third."
      />

      <p>
        That single degree is the last mile between them: Harmonic Minor&apos;s flat third is what
        makes it read as minor at all, and Harmonic Major&apos;s natural third is what keeps it
        major despite the borrowed flat sixth. Everything else - the augmented second, the leading
        tone - is already identical. Reading it is one thing; the difference is much more obvious
        held under a drone, which is what the links under each figure are for.
      </p>
    </>
  );
}
