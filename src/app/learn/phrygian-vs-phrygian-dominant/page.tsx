import type { Metadata } from "next";

import { ScaleFigure } from "@/components/Learn/ScaleFigure";
import { LEARN_STYLES } from "@/lib/design";
import { learnViewMetadata, metadataForSlugPage } from "@/lib/metadata";
import { ScaleModeType } from "@/types/enums/ScaleModeType";

export const metadata: Metadata = metadataForSlugPage(
  learnViewMetadata,
  "/learn/phrygian-vs-phrygian-dominant",
  "Phrygian vs. Phrygian Dominant",
  "Two scales on the same tonic, sharing the same flat second - separated by a single note on the third degree.",
);

export default function PhrygianVsPhrygianDominantPage() {
  return (
    <>
      <h1 className="text-3xl font-semibold">Phrygian vs. Phrygian Dominant: one note apart</h1>

      <p>
        Both of these start on C, and both hold the flat second that gives Phrygian its
        unmistakable, unsettled sound - the half-step down from the tonic that no other minor mode
        has. Against that same tonic, they run identically for the first two degrees, and then they
        disagree exactly once, on the third.
      </p>

      <div className={LEARN_STYLES.comparisonGrid}>
        <ScaleFigure
          tonic="C"
          scaleMode={ScaleModeType.Phrygian}
          highlightedDegree={3}
          caption="C Phrygian holds a flat third against the tonic - the darker of the two."
        />
        <ScaleFigure
          tonic="C"
          scaleMode={ScaleModeType.PhrygianDominant}
          highlightedDegree={3}
          caption="C Phrygian Dominant raises that third by a semitone, into major."
        />
      </div>

      <p>
        The wheel shows exactly what that one degree costs: the third-degree wedge jumps a full step
        further clockwise in Phrygian Dominant, and the spoke drawn from the center recolors to the
        interval that degree now forms with the tonic. Everything else on the two wheels - the flat
        second, the flat sixth, the flat seventh - stays put.
      </p>

      <p>
        That single degree is the whole difference between a minor mode and what is really a major
        third sitting one half-step above a flat second - the gap listeners hear as "exotic," and
        the reason Phrygian Dominant turns up under names like the Spanish or Gypsy scale. Reading
        the two side by side is one thing; the difference is much more obvious held under a drone,
        which is what the links under each figure are for.
      </p>
    </>
  );
}
