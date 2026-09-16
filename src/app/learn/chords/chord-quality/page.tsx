import type { Metadata } from "next";
import Link from "next/link";

import { ComparisonGrid2 } from "@/components/Learn/ComparisonGrid";
import { QualityRow } from "@/components/Learn/QualityRow";
import { StaticChordFigure } from "@/components/Learn/StaticChordFigure";
import { LEARN_STYLES } from "@/lib/design";
import { learnViewMetadata, metadataForSlugPage } from "@/lib/metadata";
import { ChordType } from "@/types/enums/ChordType";

export const metadata: Metadata = metadataForSlugPage(
  learnViewMetadata,
  "/learn/chords/chord-quality",
  "Chord Quality",
  "A chord's quality is its shape - the pattern of intervals stacked on the root - not which note that root happens to be.",
);

export default function ChordQualityPage() {
  return (
    <>
      <Link href="/learn/chords" className={LEARN_STYLES.link}>
        ← Chords
      </Link>

      <h1 className={LEARN_STYLES.h1}>Chord Quality</h1>

      <p>
        &ldquo;Major,&rdquo; &ldquo;minor,&rdquo; &ldquo;diminished,&rdquo; &ldquo;augmented&rdquo;
        - these name a chord&apos;s quality, not its root. A quality is the pattern of intervals
        stacked on top of the root: major is a stack of a major 3rd then a minor 3rd, minor is the
        same two intervals in the other order. The root just says where the pattern starts; the
        pattern itself is what makes it major.
      </p>

      <h2 className={LEARN_STYLES.h2}>Independent of the tonic</h2>

      <p>
        Because quality is a pattern rather than a specific set of notes, it doesn&apos;t care what
        key you&apos;re in or which note you build it on. A major triad rooted on C and a major
        triad rooted on G are different chords - different notes, different sound in context - but
        the same quality, the same shape, just rotated to a different starting wedge.
      </p>

      <ComparisonGrid2>
        <StaticChordFigure
          rootNote="C"
          chordType={ChordType.Major}
          inversionIndex={0}
          caption="C major - major 3rd, then minor 3rd, from C"
        />
        <StaticChordFigure
          rootNote="G"
          chordType={ChordType.Major}
          inversionIndex={0}
          caption="G major - the same stack of intervals, from G"
        />
      </ComparisonGrid2>

      <h2 className={LEARN_STYLES.h2}>The physics: the gaps don&apos;t move</h2>

      <p>
        Transposing a chord - sliding it to a different root - shifts every note by the same
        distance, so the gaps between the notes stay exactly the same. Those gaps are what your
        ear actually tracks: the frequency ratios between the notes of a major triad are the same
        whether it&apos;s rooted on C or G or any other note, which is why &ldquo;major&rdquo; is
        one recognizable sound rather than twelve unrelated ones. Quality is what survives
        transposition; root is what doesn&apos;t.
      </p>

      <h2 className={LEARN_STYLES.h2}>Named twice: a suffix, and a color</h2>

      <p>
        The app marks a quality two ways, and both stay fixed wherever the chord sits on the
        wheel: a color, and a suffix - shown here in both its long form and its symbol, the short
        form that actually gets attached to a chord name or roman numeral (covered in{" "}
        <Link href="/learn/chords/roman-numerals" className={LEARN_STYLES.link}>
          Roman Numeral Notation
        </Link>
        ).
      </p>

      <table className="w-full border-collapse text-left">
        <thead>
          <tr className={LEARN_STYLES.comparisonTableRow}>
            <th className="p-0"></th>
            <th className="w-1/3 px-snug py-tight">Quality</th>
            <th className="px-snug py-tight">Symbolic notation</th>
            <th className="px-snug py-tight">Letter notation</th>
          </tr>
        </thead>
        <tbody>
          <QualityRow chordType={ChordType.Major} />
          <QualityRow chordType={ChordType.Minor} />
          <QualityRow chordType={ChordType.Diminished} />
          <QualityRow chordType={ChordType.Augmented} />
          <QualityRow chordType={ChordType.Sus4} />
          <QualityRow chordType={ChordType.Dominant7} />
          <QualityRow chordType={ChordType.Major7} />
          <QualityRow chordType={ChordType.Minor7} />
          <QualityRow chordType={ChordType.HalfDiminished} />
          <QualityRow chordType={ChordType.Diminished7} />
        </tbody>
      </table>

      <p>
        The most symmetrical qualities - augmented and diminished 7th chords - take that
        rotation-independence a step further: not only does the quality stay the same when you
        transpose it, several of its own notes are equally valid roots for the identical shape.
        See{" "}
        <Link href="/learn/symmetry-and-dissonance" className={LEARN_STYLES.link}>
          Symmetry and Dissonance
        </Link>{" "}
        for why that makes them sound the way they do.
      </p>
    </>
  );
}
