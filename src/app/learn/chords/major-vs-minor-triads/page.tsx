import type { Metadata } from "next";
import Link from "next/link";

import { ComparisonGrid2 } from "@/components/Learn/layout/ComparisonGrid";
import { ChordWheel } from "@/components/Learn/figures/ChordWheel";
import { SeeAlso } from "@/components/Learn/prose/SeeAlso";
import { LEARN_STYLES } from "@/lib/design";
import { learnViewMetadata, metadataForSlugPage } from "@/lib/metadata";
import { ChordType } from "@/types/enums/ChordType";

export const metadata: Metadata = metadataForSlugPage(
  learnViewMetadata,
  "/learn/chords/major-vs-minor-triads",
  "Major and Minor Triads",
  "The major and minor triad are the two most common chords in Western music - built on the same root, one semitone apart on the third.",
);

export default function MajorVsMinorPage() {
  return (
    <>
      <Link href="/learn/chords" className={LEARN_STYLES.link}>
        ← Chords
      </Link>

      <h1 className={LEARN_STYLES.h1}>Major and Minor Triads</h1>

      <p>
        The <i>major triad</i> and the <i>minor triad</i> are the two chords Western music leans on most. Built
        on the same root, they differ by exactly one note - the 3rd - and that single semitone is
        the whole difference between bright and dark. G major is G, B, D; G minor is the same G and
        D with the third dropped to Bb.
      </p>

      <ComparisonGrid2>
        <ChordWheel
          rootNote="G"
          chordType={ChordType.Major}
          inversionIndex={0}
          caption="G major (G)"
        />
        <ChordWheel
          rootNote="G"
          chordType={ChordType.Minor}
          inversionIndex={0}
          caption="G minor (Gm)"
        />
      </ComparisonGrid2>

      <SeeAlso
        items={[
          "triad-inversions",
          "chord-quality",
          "roman-numerals",
        ]}
      />
    </>
  );
}
