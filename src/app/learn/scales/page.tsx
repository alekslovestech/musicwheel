import type { Metadata } from "next";
import Link from "next/link";

import { LearnTags } from "@/components/Learn/LearnTags";
import { LEARN_STYLES } from "@/lib/design";
import { LearnTag } from "@/types/enums/LearnTag";
import { learnViewMetadata, metadataForSlugPage } from "@/lib/metadata";

export const metadata: Metadata = metadataForSlugPage(
  learnViewMetadata,
  "/learn/scales",
  "Scales",
  "How the modes relate to each other, what the harmonic scale names mean, and pairs of scales that differ by exactly one note.",
);

export default function ScalesIndexPage() {
  return (
    <>
      <Link href="/learn" className={LEARN_STYLES.link}>
        ← Learn
      </Link>

      <h1 className={LEARN_STYLES.h1}>Scales</h1>
      <p>
        Everything about scales and modes: how they relate, what their names mean, and how they
        differ.
      </p>

      <h2 className={LEARN_STYLES.h2}>
        <Link href="/learn/scales/greek-modes" className={LEARN_STYLES.link}>
          Greek modes (aka Church modes)
        </Link>
        <LearnTags tags={[LearnTag.Scales, LearnTag.Essential]} />
      </h2>
      <p>The seven traditional names, in order, and one scale rotated seven ways.</p>

      <h2 className={LEARN_STYLES.h2}>
        <Link href="/learn/scales/scale-degrees" className={LEARN_STYLES.link}>
          Scale Degrees
        </Link>
        <LearnTags tags={[LearnTag.BasicConcepts, LearnTag.Essential]} />
      </h2>
      <p>What each numbered position in a scale is called, and why the names matter.</p>

      <h2 className={LEARN_STYLES.h2}>
        <Link href="/learn/scales/roman-numerals" className={LEARN_STYLES.link}>
          Roman Numeral Notation
        </Link>
        <LearnTags tags={[LearnTag.BasicConcepts, LearnTag.Essential]} />
      </h2>
      <p>How chords get numbered from the tonic the same way scale degrees do.</p>

      <h2 className={LEARN_STYLES.h2}>
        <Link href="/learn/scales/relative-vs-parallel-modes" className={LEARN_STYLES.link}>
          Relative vs. Parallel Modes
        </Link>
        <LearnTags tags={[LearnTag.BasicConcepts, LearnTag.Essential]} />
      </h2>
      <p>Same notes, different tonic - or the same tonic, different notes.</p>

      <h2 className={LEARN_STYLES.h2}>
        <Link href="/learn/scales/comparisons" className={LEARN_STYLES.sectionLink}>
          Comparisons
        </Link>
        <LearnTags tags={[LearnTag.Scales]} />
      </h2>
      <p>Two modes on the same tonic, one note apart.</p>

      <h2 className={LEARN_STYLES.h2}>
        <Link href="/learn/scales/harmonic" className={LEARN_STYLES.link}>
          What Makes a Scale “Harmonic”?
        </Link>
        <LearnTags tags={[LearnTag.BasicConcepts, LearnTag.Scales]} />
      </h2>
      <p>What the name actually means, and the gap it leaves behind.</p>

      <h2 className={LEARN_STYLES.h2}>
        <Link href="/learn/scales/modal-families" className={LEARN_STYLES.link}>
          Modal Families Beyond the Major Scale
        </Link>
        <LearnTags tags={[LearnTag.Scales]} />
      </h2>
      <p>Other scales with famous rotations of their own, the way the major scale has the Greek modes.</p>
    </>
  );
}
