import type { Metadata } from "next";

import { IndexEntry } from "@/components/Learn/layout/IndexEntry";
import { BackLink } from "@/components/Learn/layout/BackLink";
import { LEARN_STYLES } from "@/lib/design";
import { learnViewMetadata, metadataForSlugPage } from "@/lib/metadata";

export const metadata: Metadata = metadataForSlugPage(
  learnViewMetadata,
  "/learn/chords",
  "Intervals and Chords",
  "Interval inversions, major vs. minor, chord quality, and how a triad keeps its identity through its inversions.",
);

export default function ChordsIndexPage() {
  return (
    <>
      <BackLink to="learn" />

      <h1 className={LEARN_STYLES.h1}>Intervals and Chords</h1>
      <p>
        Intervals and the chords built from them: what makes one major or minor, and how it&apos;s
        labeled.
      </p>

      <IndexEntry id="interval-inversions">
        Flip an interval upside down and the number changes - but a <i>minor second</i> and a{" "}
        <i>major seventh</i> still sound like close relatives.
      </IndexEntry>

      <IndexEntry id="major-vs-minor-triads">
        The two most common chords in Western music - one semitone apart on the third.
      </IndexEntry>

      <IndexEntry id="chord-quality">
        Why &ldquo;major&rdquo; is a shape, not a set of notes - and stays the same color and
        suffix no matter which note it&apos;s rooted on.
      </IndexEntry>

      <IndexEntry id="triad-inversions">
        Same three notes, different note on the bottom.
      </IndexEntry>
    </>
  );
}
