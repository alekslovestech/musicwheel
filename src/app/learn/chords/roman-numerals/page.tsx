import type { Metadata } from "next";
import Link from "next/link";

import { RomanQuality } from "@/components/Learn/RomanQuality";
import { ScaleFigure } from "@/components/Learn/ScaleFigure";
import { LEARN_STYLES } from "@/lib/design";
import { learnViewMetadata, metadataForSlugPage } from "@/lib/metadata";
import { ChordType } from "@/types/enums/ChordType";
import { ScaleModeType } from "@/types/enums/ScaleModeType";
import { ScalePlaybackMode } from "@/types/enums/ScalePlaybackMode";
import { ixScaleDegree } from "@/types/ScaleModes/ScaleDegreeType";

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
        on each degree: <RomanQuality degree={1} chordType={ChordType.Major} /> is the major chord on
        the 1st degree, <RomanQuality degree={5} chordType={ChordType.Major} /> on the 5th, and
        so on.
      </p>

      <p>
        Case carries the chord&apos;s quality: uppercase for major, lowercase for minor. In C
        major, the 1st degree carries a major triad and the 6th a minor one, so that&apos;s shown as {" "}
        <RomanQuality degree={1} chordType={ChordType.Major} /> and {" "}
        <RomanQuality degree={6} chordType={ChordType.Minor} /> 
      </p>

      <p>
        Another common chord is the diminished triad, shown in its traditional notation as <b>°</b> next to the Roman numeral, for example{" "}
        <RomanQuality degree={7} chordType={ChordType.Diminished} /> is the diminished triad
        on the 7th degree. See{" "}
        <Link href="/learn/chords/chord-quality" className={LEARN_STYLES.link}>
          Chord Quality
        </Link>{" "}
        for the full table of chord qualities, their suffixes and their characteristic color in the app
      </p>

      <h2 className={LEARN_STYLES.h2}>All 7, in one scale</h2>

      <p>
        Every major scale produces the same seven triads, a few major and minor triads, and one diminished chord at the 7th degree, 
        i.e. the sequence of triads here would be I, ii, iii, IV, V, vi, vii°         
      </p>

      <ScaleFigure
        tonic="C"
        scaleType={ScaleModeType.Ionian}
        scalePlaybackMode={ScalePlaybackMode.Triad}
        highlightedDegree={ixScaleDegree(4)}
        caption="All seven degrees of C major, with IV selected (the 4th degree's major triad)."
        showRibbon
        linearShowLabels
        isCompact
      />
    </>
  );
}
