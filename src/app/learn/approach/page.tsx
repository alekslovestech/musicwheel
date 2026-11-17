import type { Metadata } from "next";

import { IndexEntry } from "@/components/Learn/layout/IndexEntry";
import { BackLink } from "@/components/Learn/layout/BackLink";
import { LEARN_STYLES } from "@/lib/design";
import { learnViewMetadata, metadataForSlugPage } from "@/lib/metadata";

export const metadata: Metadata = metadataForSlugPage(
  learnViewMetadata,
  "/learn/approach",
  "Approach",
  "The idea behind the app: the chromatic circle, and the parts of theory it makes easier to see.",
);

export default function ApproachIndexPage() {
  return (
    <>
      <BackLink to="learn" />

      <h1 className={LEARN_STYLES.h1}>Approach</h1>

      <p>Motivation behind this app, why it exists and why it&apos;s built the way it is.</p>

      <p>Start here and follow Next through to the end - each article builds on the last.</p>

      <IndexEntry id="chromatic-circle">
        Why a circle instead of a line makes intervals and inversions easier to see, and how it
        compares to the circle of fifths and the Tonnetz.
      </IndexEntry>

      <IndexEntry id="whats-useful-about-music-theory">
        The parts that describe sound: 12 equal notes, intervals as distances, chords as shapes, and
        the vocabulary for recognizing what you hear.
      </IndexEntry>

      <IndexEntry id="music-theory-on-the-chromatic-circle">
        The same intervals, chords, progressions and scales from What&apos;s Useful About Music
        Theory, this time drawn on the chromatic circle instead of written on the staff.
      </IndexEntry>

      <h2 className={LEARN_STYLES.h2}>Reference</h2>
      <p>Supporting detail for the sequence above, not part of its path.</p>

      <IndexEntry id="color-coding">
        What the colors on the wheel, the ribbon, and every legend actually mean.
      </IndexEntry>

      <IndexEntry id="accidentals">
        Why the keyboard plays down sharps and flats, resolves a real spelling once you&apos;re in
        a key, and never shows a double sharp or double flat.
      </IndexEntry>
    </>
  );
}
