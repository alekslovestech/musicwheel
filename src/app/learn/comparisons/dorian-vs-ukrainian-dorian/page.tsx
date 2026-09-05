import type { Metadata } from "next";

import { ScaleDegreeComparison } from "@/components/Learn/ScaleDegreeComparison";
import { ComparisonsBackLink } from "@/components/Learn/ComparisonsBackLink";
import { learnViewMetadata, metadataForSlugPage } from "@/lib/metadata";
import { ScaleModeType } from "@/types/enums/ScaleModeType";
import { ixScaleDegree } from "@/types/ScaleModes/ScaleDegreeType";

export const metadata: Metadata = metadataForSlugPage(
  learnViewMetadata,
  "/learn/comparisons/dorian-vs-ukrainian-dorian",
  "Dorian vs. Ukrainian Dorian",
  "Two scales on the same tonic, sharing the same minor third and raised sixth - separated by a single note on the fourth degree.",
);

export default function DorianVsUkrainianDorianPage() {
  return (
    <>
      <ComparisonsBackLink />
      <h1 className="text-3xl font-semibold">Dorian vs. Ukrainian Dorian: one note apart</h1>

      <p>
        Both of these start on C, and both are Dorian: a minor third and, unusually for a minor
        mode, a natural sixth. Held against the same tonic, they run identically for the first three
        degrees - and then they disagree exactly once, on the fourth.
      </p>

      <ScaleDegreeComparison
        modeA={ScaleModeType.Dorian}
        modeB={ScaleModeType.UkrainianDorian}
        degree={ixScaleDegree(4)}
        captionA="C Dorian holds a natural fourth against the tonic - the darker of the two."
        captionB="C Ukrainian Dorian raises that fourth by a semitone, into a sharp four."
      />

      <p>
        That single degree turns a plain minor scale into something with a foot in two camps: a
        minor third below the raised fourth, and a major-feeling gap above it, the combination that
        gives Ukrainian Dorian its name and its use in Eastern European folk melodies. Reading it is
        one thing; the difference is much more obvious held under a drone, which is what the links
        under each figure are for.
      </p>
    </>
  );
}
