import type { Metadata } from "next";

import { ScaleFigure } from "@/components/Learn/ScaleFigure";
import { LEARN_STYLES } from "@/lib/design";
import { learnViewMetadata, metadataForSlugPage } from "@/lib/metadata";
import { ScaleModeType } from "@/types/enums/ScaleModeType";

export const metadata: Metadata = metadataForSlugPage(
  learnViewMetadata,
  "/learn/aeolian-vs-dorian",
  "Aeolian vs. Dorian",
  "Two minor scales on the same tonic, separated by a single note - what the sixth degree changes.",
);

export default function AeolianVsDorianPage() {
  return (
    <>
      <h1 className="text-3xl font-semibold">Aeolian vs. Dorian: one note apart</h1>

      <p>
        Both of these are minor scales, and both start on C. Held against the same tonic, they run
        the same first five degrees - and then they disagree exactly once, on the sixth.
      </p>

      <div className={LEARN_STYLES.comparisonGrid}>
        <ScaleFigure
          tonic="C"
          scaleMode={ScaleModeType.Aeolian}
          highlightedDegree={6}
          caption="C Aeolian holds a flat sixth against the tonic - the darker of the two."
        />
        <ScaleFigure
          tonic="C"
          scaleMode={ScaleModeType.Dorian}
          highlightedDegree={6}
          caption="C Dorian raises that sixth by a semitone, and the whole scale lifts with it."
        />
      </div>

      <p>
        The wheel makes the difference positional rather than verbal: the flag marks the tonic in
        both, the sixth degree sits one wedge further clockwise in Dorian, and the spoke drawn from
        the center takes its color from the interval that degree forms with the tonic. Everything
        else on the two wheels is identical.
      </p>

      <p>
        That single degree is why Dorian is the brighter minor - it is the scale that keeps a minor
        third but refuses the minor sixth. Reading it is one thing; the difference is much more
        obvious held under a drone, which is what the links under each figure are for.
      </p>
    </>
  );
}
