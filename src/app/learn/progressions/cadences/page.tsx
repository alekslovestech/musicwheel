import type { Metadata } from "next";

import { ArticlePage } from "@/components/Learn/layout/ArticlePage";
import { ComparisonGrid2, ComparisonGrid3 } from "@/components/Learn/layout/ComparisonGrid";
import { ChordWheel } from "@/components/Learn/figures/ChordWheel";
import { ProgressionStaff } from "@/components/Learn/figures/ProgressionStaff";
import { LEARN_STYLES } from "@/lib/design";
import { learnViewMetadata, metadataForSlugPage } from "@/lib/metadata";
import { ChordProgressionType } from "@/types/enums/ChordProgressionType";
import { ChordType } from "@/types/enums/ChordType";

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

      <ComparisonGrid2>
        <ChordWheel
          rootNote="G"
          chordType={ChordType.Major}
          inversionIndex={0}
          caption="V: G major"
          showKeyboard={false}
        />
        <ChordWheel
          rootNote="C"
          chordType={ChordType.Major}
          inversionIndex={0}
          caption="I: C major"
          showKeyboard={false}
        />
      </ComparisonGrid2>

      <h2 className={LEARN_STYLES.h2}>Line Cliche: I–I+–vi/I</h2>

      <p>
        Written out, the <i>line cliche</i> looks like 3 unrelated chords, 2 of them with extra
        symbols: C, C+, and A minor over C.
      </p>

      <ProgressionStaff
        tonic="C"
        progression={ChordProgressionType.Line_Cliche}
        caption="Line Cliche in C"
      />

      <p>
        On the circle, 2 wedges, C and E, stay lit throughout. The third one climbs 1 semitone at a
        time: G, G♯, A.
      </p>

      <ComparisonGrid3>
        <ChordWheel
          rootNote="C"
          chordType={ChordType.Major}
          inversionIndex={0}
          caption={"I: C major\nC E G"}
          showKeyboard={false}
        />
        <ChordWheel
          rootNote="C"
          chordType={ChordType.Augmented}
          inversionIndex={0}
          caption={"I+: C augmented\nC E G♯"}
          showKeyboard={false}
        />
        <ChordWheel
          rootNote="A"
          chordType={ChordType.Minor}
          inversionIndex={1}
          caption={"vi/I: A minor over C\nC E A"}
          showKeyboard={false}
        />
      </ComparisonGrid3>
    </ArticlePage>
  );
}
