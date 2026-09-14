import type { Metadata } from "next";
import Link from "next/link";

import { StaticChordFigure } from "@/components/Learn/StaticChordFigure";
import { LEARN_STYLES } from "@/lib/design";
import { learnViewMetadata, metadataForSlugPage } from "@/lib/metadata";
import { ChordType } from "@/types/enums/ChordType";
import { ComparisonGrid3 } from "@/components/Learn/ComparisonGrid";

export const metadata: Metadata = metadataForSlugPage(
  learnViewMetadata,
  "/learn/triad-inversions",
  "Triad Inversions",
  "Root position, first inversion, second inversion - the same three notes of a G major triad, marked with a different bass each time.",
);

export default function TriadInversionsPage() {
  return (
    <>
      <Link href="/learn" className={LEARN_STYLES.link}>
        ← Learn
      </Link>

      <h1 className={LEARN_STYLES.h1}>Triad Inversions</h1>

      <p>
        A triad is three notes, but which one is lowest doesn&apos;t change which chord it is - it
        only changes the inversion. All three wheels below light the same three wedges: C, E and G
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
        Nothing about the chord&apos;s identity changes between these three - same notes, same name.
        What changes is the bass, and that&apos;s audible even when the chord itself isn&apos;t: a
        bass line can walk between inversions of one chord, or between different chords entirely,
        and the ear tracks the bottom note either way.
      </p>
    </>
  );
}
