import type { Metadata } from "next";
import Link from "next/link";

import { ComparisonGrid2 } from "@/components/Learn/ComparisonGrid";
import { Roman } from "@/components/Learn/Roman";
import { StaticChordFigure } from "@/components/Learn/StaticChordFigure";
import { LEARN_STYLES } from "@/lib/design";
import { learnViewMetadata, metadataForSlugPage } from "@/lib/metadata";
import { ChordType } from "@/types/enums/ChordType";

export const metadata: Metadata = metadataForSlugPage(
  learnViewMetadata,
  "/learn/scales/roman-numerals",
  "Roman Numeral Notation",
  "Roman numerals number chords the same way scale degrees number notes - counted from the tonic, with case marking major or minor.",
);

export default function RomanNumeralsPage() {
  return (
    <>
      <Link href="/learn/scales" className={LEARN_STYLES.link}>
        ← Scales
      </Link>

      <h1 className={LEARN_STYLES.h1}>Roman Numeral Notation</h1>

      <p>
        <Link href="/learn/scales/scale-degrees" className={LEARN_STYLES.link}>
          Scale degrees
        </Link>{" "}
        number notes, counted from the tonic. Roman numerals number chords the same way, one built
        on each degree: <Roman>I</Roman> is the chord on the 1st degree, <Roman>V</Roman> on the
        5th, and so on.
      </p>

      <p>Case carries the chord&apos;s quality: uppercase is major, lowercase is minor.</p>

      <ComparisonGrid2>
        <StaticChordFigure
          rootNote="C"
          chordType={ChordType.Major}
          inversionIndex={0}
          caption="I - C major, built on C major's 1st degree"
        />
        <StaticChordFigure
          rootNote="A"
          chordType={ChordType.Minor}
          inversionIndex={0}
          caption="vi - A minor, built on C major's 6th degree"
        />
      </ComparisonGrid2>

      <p>
        Beyond the triad, a suffix names the rest of the chord - a few of the common ones:
        &ldquo;7&rdquo; for a seventh built the plain way on that numeral (<Roman>V7</Roman>,{" "}
        <Roman>ii7</Roman>), &ldquo;Δ7&rdquo; for a major 7th (<Roman>IΔ7</Roman>), &ldquo;°&rdquo;
        for diminished (<Roman>vii°</Roman>), &ldquo;ø7&rdquo; for half-diminished (
        <Roman>iiø7</Roman>), and &ldquo;+&rdquo; for augmented (<Roman>III+</Roman>).
      </p>
    </>
  );
}
