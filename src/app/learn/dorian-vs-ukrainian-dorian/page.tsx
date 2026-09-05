import type { Metadata } from "next";

import { ScaleFigure } from "@/components/Learn/ScaleFigure";
import { LEARN_STYLES } from "@/lib/design";
import { learnViewMetadata, metadataForSlugPage } from "@/lib/metadata";
import { ScaleModeType } from "@/types/enums/ScaleModeType";

export const metadata: Metadata = metadataForSlugPage(
  learnViewMetadata,
  "/learn/dorian-vs-ukrainian-dorian",
  "Dorian vs. Ukrainian Dorian",
  "Two scales on the same tonic, sharing the same minor third and raised sixth - separated by a single note on the fourth degree.",
);

export default function DorianVsUkrainianDorianPage() {
  return (
    <>
      <h1 className="text-3xl font-semibold">Dorian vs. Ukrainian Dorian: one note apart</h1>

      <p>
        Both of these start on C, and both are Dorian: a minor third and, unusually for a minor
        mode, a natural sixth. Held against the same tonic, they run identically for the first three
        degrees - and then they disagree exactly once, on the fourth.
      </p>

      <div className={LEARN_STYLES.comparisonGrid}>
        <ScaleFigure
          tonic="C"
          scaleMode={ScaleModeType.Dorian}
          highlightedDegree={4}
          caption="C Dorian holds a natural fourth against the tonic - the darker of the two."
        />
        <ScaleFigure
          tonic="C"
          scaleMode={ScaleModeType.UkrainianDorian}
          highlightedDegree={4}
          caption="C Ukrainian Dorian raises that fourth by a semitone, into a sharp four."
        />
      </div>

      <p>
        The wheel makes the difference positional rather than verbal: the fourth-degree wedge sits
        one step further clockwise in Ukrainian Dorian, and the spoke drawn from the center recolors
        to the interval that degree now forms with the tonic. Everything else on the two wheels -
        the minor third, the natural sixth, the flat seventh - stays put.
      </p>

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
