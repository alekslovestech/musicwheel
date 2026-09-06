import type { Metadata } from "next";
import Link from "next/link";

import { LEARN_STYLES } from "@/lib/design";
import { learnViewMetadata, metadataForSlugPage } from "@/lib/metadata";

export const metadata: Metadata = metadataForSlugPage(
  learnViewMetadata,
  "/learn/scales",
  "Scales",
  "How the modes relate to each other, what the harmonic and melodic scale names mean, and pairs of scales that differ by exactly one note.",
);

export default function ScalesIndexPage() {
  return (
    <>
      <Link href="/learn" className={LEARN_STYLES.link}>
        ← Learn
      </Link>

      <h1 className="text-3xl font-semibold">Scales</h1>
      <p>
        Everything about scales and modes: how they relate, what their names mean, and how they
        differ.
      </p>

      <h2 className="text-xl font-semibold">
        <Link href="/learn/scales/greek-modes" className={LEARN_STYLES.link}>
          How the Greek Modes Relate to Each Other
        </Link>
      </h2>
      <p>Relative modes, parallel modes, and one scale rotated seven ways.</p>

      <h2 className="text-xl font-semibold">
        <Link href="/learn/scales/relative-vs-parallel-modes" className={LEARN_STYLES.link}>
          Relative vs. Parallel Modes
        </Link>
      </h2>
      <p>Same notes, different tonic - or the same tonic, different notes.</p>

      <h2 className="text-xl font-semibold">
        <Link href="/learn/scales/comparisons" className={LEARN_STYLES.link}>
          Comparisons
        </Link>
      </h2>
      <p>Two modes on the same tonic, one note apart.</p>

      <h2 className="text-xl font-semibold">
        <Link href="/learn/scales/harmonic" className={LEARN_STYLES.link}>
          What Makes a Scale “Harmonic”?
        </Link>
      </h2>
      <p>What the name actually means, and the gap it leaves behind.</p>

      <h2 className="text-xl font-semibold">
        <Link href="/learn/scales/melodic" className={LEARN_STYLES.link}>
          What Makes a Scale “Melodic”?
        </Link>
      </h2>
      <p>The same gap, closed back up - and what that costs.</p>
    </>
  );
}
