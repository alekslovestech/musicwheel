import type { Metadata } from "next";
import Link from "next/link";

import { RomanQuality } from "@/components/Learn/RomanQuality";
import { LEARN_STYLES } from "@/lib/design";
import { learnViewMetadata, metadataForSlugPage } from "@/lib/metadata";
import { ChordType } from "@/types/enums/ChordType";

export const metadata: Metadata = metadataForSlugPage(
  learnViewMetadata,
  "/learn/chords/roman-numerals",
  "Roman Numeral Notation",
  "Roman numerals number chords the same way scale degrees number notes - counted from the tonic, with case marking major or minor.",
);

export default function RomanNumeralsPage() {
  return (
    <>
      <Link href="/learn/chords" className={LEARN_STYLES.link}>
        ← Chords
      </Link>

      <h1 className={LEARN_STYLES.h1}>Roman Numeral Notation</h1>

      <p>
        <Link href="/learn/scales/scale-degrees" className={LEARN_STYLES.link}>
          Scale degrees
        </Link>{" "}
        number notes, counted from the tonic. Roman numerals number chords the same way, one built
        on each degree: <RomanQuality degree={1} chordType={ChordType.Major} /> is the chord on
        the 1st degree, <RomanQuality degree={5} chordType={ChordType.Major} /> on the 5th, and
        so on.
      </p>

      <p>
        Case carries the chord&apos;s quality: uppercase for major, lowercase for minor. In C
        major, the 1st degree carries a major triad and the 6th a minor one, so that&apos;s{" "}
        <RomanQuality degree={1} chordType={ChordType.Major} /> but{" "}
        <RomanQuality degree={6} chordType={ChordType.Minor} /> - same suffix (none), different
        case.
      </p>

      <p>
        Case alone only distinguishes major from minor, though - a diminished chord still needs a
        suffix on top of the lowercase, since &ldquo;lowercase&rdquo; already means minor:{" "}
        <RomanQuality degree={7} chordType={ChordType.Diminished} /> is the diminished triad
        on the 7th degree. See{" "}
        <Link href="/learn/chords/chord-quality" className={LEARN_STYLES.link}>
          Chord Quality
        </Link>{" "}
        for the full table of suffixes, one per quality, and why the same suffix and color follow
        a quality no matter which degree it&apos;s built on.
      </p>
    </>
  );
}
