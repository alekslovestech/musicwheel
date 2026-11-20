import type { Metadata } from "next";

import { ArticlePage } from "@/components/Learn/layout/ArticlePage";
import { ProgressionFigure } from "@/components/Learn/figures/ProgressionFigure";
import { LEARN_STYLES } from "@/lib/design";
import { learnViewMetadata, metadataForSlugPage } from "@/lib/metadata";
import { ChordProgressionType } from "@/types/enums/ChordProgressionType";

export const metadata: Metadata = metadataForSlugPage(
  learnViewMetadata,
  "/learn/progressions/cadences",
  "Cadences",
  "A cadence is a short chord progression that closes a phrase - the perfect cadence and the line cliche drawn on the chromatic circle.",
);

export default function CadencesPage() {
  return (
    <ArticlePage
      id="cadences"
      seeAlso={["chord-progressions", "roman-numerals"]}
    >
      <h1 className={LEARN_STYLES.h1}>Cadences</h1>

      <p>
        A cadence is a short chord progression that closes a phrase, the way punctuation closes a
        sentence. Its last chord is where the ear expects to land.
      </p>

      <h2 className={LEARN_STYLES.h2}>Perfect cadence: V–I</h2>

      <p>
        The <i>perfect cadence</i> moves from the chord on the 5th degree to the chord on the 1st.
        In C, the root moves 5 semitones up to the tonic.
      </p>

      <ProgressionFigure
        tonic="C"
        progression={ChordProgressionType.Perfect_Cadence}
        caption="The perfect cadence in C"
      />

      <h2 className={LEARN_STYLES.h2}>Line Cliche: I–I+–vi/I</h2>

      <p>
        Written out, the <i>line cliche</i> looks like 3 unrelated chords, 2 of them with extra
        symbols: C, C+, and A minor over C. On the circle, 2 wedges, C and E, stay lit throughout.
        The third one climbs 1 semitone at a time: G, G♯, A.
      </p>

      <ProgressionFigure
        tonic="C"
        progression={ChordProgressionType.Line_Cliche}
        caption="The line cliche in C"
      />
    </ArticlePage>
  );
}
