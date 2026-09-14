import type { Metadata } from "next";
import Link from "next/link";

import { ComparisonGrid3 } from "@/components/Learn/ComparisonGrid";
import { StaticChordFigure } from "@/components/Learn/StaticChordFigure";
import { LEARN_STYLES } from "@/lib/design";
import { learnViewMetadata, metadataForSlugPage } from "@/lib/metadata";
import { ChordType } from "@/types/enums/ChordType";

export const metadata: Metadata = metadataForSlugPage(
  learnViewMetadata,
  "/learn/major-vs-minor-triads",
  "Major and Minor Triads",
  "The major and minor triad are the two most common chords in Western music, each carried through root position and both inversions.",
);

export default function MajorVsMinorPage() {
  return (
    <>
      <Link href="/learn" className={LEARN_STYLES.link}>
        ← Learn
      </Link>

      <h1 className={LEARN_STYLES.h1}>Major and Minor Triads</h1>

      <p>
        The major triad and the minor triad are the two chords Western music leans on most. Built
        on the same root, they differ by exactly one note - the 3rd - and that single semitone is
        the whole difference between bright and dark. Both come up constantly in all three of their
        positions, so it&apos;s worth knowing them equally well: root position and both inversions.
      </p>

      <h2 className={LEARN_STYLES.h2}>G major</h2>

      <p>G, B, D. The bright, default-sounding triad.</p>

      <ComparisonGrid3>
        <StaticChordFigure
          rootNote="G"
          chordType={ChordType.Major}
          inversionIndex={0}
          caption="Root position: bass on G."
        />
        <StaticChordFigure
          rootNote="G"
          chordType={ChordType.Major}
          inversionIndex={1}
          caption="First inversion: bass on B."
        />
        <StaticChordFigure
          rootNote="G"
          chordType={ChordType.Major}
          inversionIndex={2}
          caption="Second inversion: bass on D."
        />
      </ComparisonGrid3>

      <h2 className={LEARN_STYLES.h2}>G minor</h2>

      <p>G, Bb, D. Same root and fifth as G major, with the third dropped a semitone.</p>

      <ComparisonGrid3>
        <StaticChordFigure
          rootNote="G"
          chordType={ChordType.Minor}
          inversionIndex={0}
          caption="Root position: bass on G."
        />
        <StaticChordFigure
          rootNote="G"
          chordType={ChordType.Minor}
          inversionIndex={1}
          caption="First inversion: bass on Bb."
        />
        <StaticChordFigure
          rootNote="G"
          chordType={ChordType.Minor}
          inversionIndex={2}
          caption="Second inversion: bass on D."
        />
      </ComparisonGrid3>
    </>
  );
}
