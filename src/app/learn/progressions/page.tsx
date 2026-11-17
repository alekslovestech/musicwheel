import type { Metadata } from "next";

import { IndexEntry } from "@/components/Learn/layout/IndexEntry";
import { BackLink } from "@/components/Learn/layout/BackLink";
import { LEARN_STYLES } from "@/lib/design";
import { learnViewMetadata, metadataForSlugPage } from "@/lib/metadata";

export const metadata: Metadata = metadataForSlugPage(
  learnViewMetadata,
  "/learn/progressions",
  "Progressions",
  "What a chord progression is, a few common ones, and how roman numerals number them from the tonic.",
);

export default function ProgressionsIndexPage() {
  return (
    <>
      <BackLink to="learn" />

      <h1 className={LEARN_STYLES.h1}>Progressions</h1>
      <p>
        What a chord progression is, a few common ones, and how roman numerals number them from the
        tonic.
      </p>

      <IndexEntry id="chord-progressions">
        A sequence of chords, recognized by how it moves from the tonic.
      </IndexEntry>

      <IndexEntry id="cadences">
        The short progressions that close a phrase.
      </IndexEntry>

      <IndexEntry id="roman-numerals">
        How chords get numbered from the tonic the same way scale degrees do.
      </IndexEntry>
    </>
  );
}
