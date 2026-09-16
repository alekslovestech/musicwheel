import type { Metadata } from "next";
import Link from "next/link";

import { ColorSwatch } from "@/components/ColorLegend/ColorSwatch";
import { Roman } from "@/components/Learn/Roman";
import { LEARN_STYLES } from "@/lib/design";
import { learnViewMetadata, metadataForSlugPage } from "@/lib/metadata";
import { ChordType } from "@/types/enums/ChordType";
import { getColorForGrouping } from "@/utils/visual/NoteGroupingColorRegistry";

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
        on each degree: <RomanQuality numeral="I" chordType={ChordType.Major} /> is the major
        chord on the 1st degree, <RomanQuality numeral="V" chordType={ChordType.Major} /> on the
        5th, and so on. See{" "}
        <Link href="/learn/chords/chord-quality" className={LEARN_STYLES.link}>
          Chord Quality
        </Link>{" "}
        for why each swatch stays the same color no matter which note the chord is rooted on.
      </p>

      <p>The most typical triad qualities, by roman numeral:</p>

      <ul className="list-disc pl-6">
        <li>
          <RomanQuality numeral="vi" chordType={ChordType.Minor} />: minor, shown as a lowercase
          numeral
        </li>
        <li>
          <RomanQuality numeral="vi°" chordType={ChordType.Diminished} />: diminished, shown
          with a ° appended
        </li>
        <li>
          <RomanQuality numeral="VI+" chordType={ChordType.Augmented} />: augmented, shown with
          a + appended
        </li>
      </ul>

      <p>The rest of the chord qualities follow the same pattern:</p>

      <ul className="list-disc pl-6">
        <li>
          <RomanQuality numeral="VI7" chordType={ChordType.Dominant7} /> for a dominant 7th
        </li>
        <li>
          <RomanQuality numeral="vi7" chordType={ChordType.Minor7} /> for a minor 7th
        </li>
        <li>
          <RomanQuality numeral="viiø7" chordType={ChordType.HalfDiminished} /> for a
          half-diminished 7th
        </li>
      </ul>
    </>
  );
}

/** A roman numeral paired with the wheel's color for that chord quality - inline in prose or a
 * list item alike. */
function RomanQuality({ numeral, chordType }: { numeral: string; chordType: ChordType }) {
  return (
    <span className="inline-flex items-center gap-1 align-baseline">
      <ColorSwatch color={getColorForGrouping(chordType)} />
      <Roman>{numeral}</Roman>
    </span>
  );
}
