import type { Metadata } from "next";

import { IndexEntry } from "@/components/Learn/layout/IndexEntry";
import { BackLink } from "@/components/Learn/layout/BackLink";
import { LEARN_STYLES } from "@/lib/design";
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
      <BackLink to="learn" />

      <h1 className={LEARN_STYLES.h1}>Scales</h1>
      <p>
        Everything about scales and modes: how they relate, what their names mean, and how they
        differ.
      </p>

      <IndexEntry id="scale-degrees">
        Numbering a scale&apos;s notes against the major scale: ♭3, ♯4 and the rest.
      </IndexEntry>

      <IndexEntry id="greek-modes">
        The seven traditional names, in order, and one scale rotated seven ways.
      </IndexEntry>

      <IndexEntry id="relative-vs-parallel-modes">
        Same notes, different tonic - or the same tonic, different notes.
      </IndexEntry>

      <IndexEntry id="harmonic">
        What the name actually means, and the gap it leaves behind.
      </IndexEntry>

      <IndexEntry id="modal-families">
        Other scales with famous rotations of their own, the way the <i>major scale</i> has the Greek modes.
      </IndexEntry>

      <h2 className={LEARN_STYLES.h2}>More on scales</h2>

      <IndexEntry id="comparisons">
        Two modes on the same tonic, one note apart.
      </IndexEntry>

      <IndexEntry id="melodic-minor-modes">
        Melodic Minor&apos;s rotation family, mostly known through jazz - the three most commonly used
        modes and the chords they&apos;re played against.
      </IndexEntry>
    </>
  );
}
