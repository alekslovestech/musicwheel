import type { Metadata } from "next";
import Link from "next/link";

import { LearnTags } from "@/components/Learn/LearnTags";
import { LEARN_STYLES } from "@/lib/design";
import { learnViewMetadata, metadataForSlugPage } from "@/lib/metadata";
import { LearnTag } from "@/types/enums/LearnTag";

export const metadata: Metadata = metadataForSlugPage(
  learnViewMetadata,
  "/learn/chords",
  "Chords",
  "Major vs. minor, how a triad keeps its identity through its inversions, and how roman numerals number chords from the tonic.",
);

export default function ChordsIndexPage() {
  return (
    <>
      <Link href="/learn" className={LEARN_STYLES.link}>
        ← Learn
      </Link>

      <h1 className={LEARN_STYLES.h1}>Chords</h1>
      <p>Building and naming chords: what makes one major or minor, and how it&apos;s labeled.</p>

      <h2 className={LEARN_STYLES.h2}>
        <Link href="/learn/chords/major-vs-minor-triads" className={LEARN_STYLES.link}>
          Major and Minor Triads
        </Link>
        <LearnTags tags={[LearnTag.BasicConcepts, LearnTag.Essential]} />
      </h2>
      <p>The two most common chords in Western music - one semitone apart on the third.</p>

      <h2 className={LEARN_STYLES.h2}>
        <Link href="/learn/chords/chord-quality" className={LEARN_STYLES.link}>
          Chord Quality
        </Link>
        <LearnTags tags={[LearnTag.BasicConcepts, LearnTag.Essential]} />
      </h2>
      <p>
        Why &ldquo;major&rdquo; is a shape, not a set of notes - and stays the same color and
        suffix no matter which note it&apos;s rooted on.
      </p>

      <h2 className={LEARN_STYLES.h2}>
        <Link href="/learn/chords/triad-inversions" className={LEARN_STYLES.link}>
          Triad Inversions
        </Link>
        <LearnTags tags={[LearnTag.BasicConcepts, LearnTag.Essential]} />
      </h2>
      <p>Same three notes, different note on the bottom.</p>

      <h2 className={LEARN_STYLES.h2}>
        <Link href="/learn/chords/roman-numerals" className={LEARN_STYLES.link}>
          Roman Numeral Notation
        </Link>
        <LearnTags tags={[LearnTag.BasicConcepts, LearnTag.Essential]} />
      </h2>
      <p>How chords get numbered from the tonic the same way scale degrees do.</p>
    </>
  );
}
