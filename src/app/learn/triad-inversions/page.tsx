import type { Metadata } from "next";
import Link from "next/link";

import { StaticChordFigure } from "@/components/Learn/StaticChordFigure";
import { LEARN_STYLES } from "@/lib/design";
import { learnViewMetadata, metadataForSlugPage } from "@/lib/metadata";
import { ChordType } from "@/types/enums/ChordType";

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

      <h1 className="text-3xl font-semibold">Triad Inversions</h1>

      <p>
        A triad is three notes, but which one is lowest doesn&apos;t change which chord it is - it
        only changes the inversion. All three wheels below light the same three wedges, G, B, and D;
        the dot marking the bass is the only thing that moves.
      </p>

      <StaticChordFigure
        rootNote="G"
        chordType={ChordType.Major}
        inversionIndex={0}
        caption="Root position: the bass dot sits on G, the note the chord is named after."
      />

      <StaticChordFigure
        rootNote="G"
        chordType={ChordType.Major}
        inversionIndex={1}
        caption="First inversion: same three wedges, bass dot moved to B."
      />

      <StaticChordFigure
        rootNote="G"
        chordType={ChordType.Major}
        inversionIndex={2}
        caption="Second inversion: same three wedges again, bass dot moved to D."
      />

      <p>
        Nothing about the chord&apos;s identity changes between these three - same notes, same name.
        What changes is the bass, and that&apos;s audible even when the chord itself isn&apos;t: a
        bass line can walk between inversions of one chord, or between different chords entirely,
        and the ear tracks the bottom note either way.
      </p>
    </>
  );
}
