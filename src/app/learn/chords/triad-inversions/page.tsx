import type { Metadata } from "next";
import Link from "next/link";

import { StaticChordFigure } from "@/components/Learn/StaticChordFigure";
import { LEARN_STYLES } from "@/lib/design";
import { learnViewMetadata, metadataForSlugPage } from "@/lib/metadata";
import { ChordType } from "@/types/enums/ChordType";
import { ComparisonGrid3 } from "@/components/Learn/ComparisonGrid";

export const metadata: Metadata = metadataForSlugPage(
  learnViewMetadata,
  "/learn/chords/triad-inversions",
  "Triad Inversions",
  "Root position, first inversion, second inversion - the same three notes of a G major triad, marked with a different bass each time.",
);

export default function TriadInversionsPage() {
  return (
    <>
      <Link href="/learn/chords" className={LEARN_STYLES.link}>
        ← Chords
      </Link>

      <h1 className={LEARN_STYLES.h1}>Triad Inversions</h1>

      <p>
        A triad is 3 notes played at once, its first inversion is the bottom note moved up 1 octave. Interestingly, this operation changes very little about how we hear the chord quality.
        For example a major chord and its first and second inversion sound almost identical, even though they have different bass notes. On the chromatic circle, this shows up as essentially the same
        shape with a different starting point. 
      </p>
      <ComparisonGrid3>   
        <StaticChordFigure
          rootNote="C"
          chordType={ChordType.Major}
          inversionIndex={0}
          caption="C major (C)"
        />

        <StaticChordFigure
          rootNote="C"
          chordType={ChordType.Major}
          inversionIndex={1}
          caption="First inversion: C/E"
        />

        <StaticChordFigure
          rootNote="C"
          chordType={ChordType.Major}
          inversionIndex={2}
          caption="Second inversion: C/G"
        />
      </ComparisonGrid3>
      <p>
        Inversions are often interchangeable for the original chord, and are used to create smoother bass lines in chord progressions.
        A chord's inversion preserves the{" "}
        <Link href="/learn/chords/chord-quality" className={LEARN_STYLES.link}>
          chord quality
        </Link>
        , and shows up as the same shape and color in the MusicWheel's interface.
      </p>
    </>
  );
}
