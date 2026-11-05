import type { Metadata } from "next";
import Link from "next/link";

import { LearnTags } from "@/components/Learn/layout/LearnTags";
import { LEARN_STYLES } from "@/lib/design";
import { LearnTag } from "@/types/enums/LearnTag";
import { learnViewMetadata, metadataForSlugPage } from "@/lib/metadata";

export const metadata: Metadata = metadataForSlugPage(
  learnViewMetadata,
  "/learn/approach",
  "Approach",
  "The app's own stance: what's wrong with how music theory usually gets taught, and what this app does about it.",
);

export default function ApproachIndexPage() {
  return (
    <>
      <Link href="/learn" className={LEARN_STYLES.link}>
        ← Learn
      </Link>

      <h1 className={LEARN_STYLES.h1}>Approach</h1>

      <p>Motivation behind this app, why it exists and why it&apos;s built the way it is.</p>

      <p>Start here and follow Next through to the end - each article builds on the last.</p>

      <h2 className={LEARN_STYLES.h2}>
        <Link href="/learn/approach/whats-wrong-with-music-theory" className={LEARN_STYLES.link}>
          What&apos;s Wrong with Music Theory
        </Link>
      </h2>
      <p>
        Historical accidents, enharmonic confusion, key signatures, pointless memorization, and
        turf wars around spelling - a tour of the parts of theory that aren&apos;t about sound.
      </p>

      <h2 className={LEARN_STYLES.h2}>
        <Link href="/learn/approach/whats-useful-about-music-theory" className={LEARN_STYLES.link}>
          What&apos;s Useful About Music Theory
        </Link>
      </h2>
      <p>
        The parts that describe sound: 12 equal notes, intervals as distances, chords as shapes, and
        the vocabulary for recognizing what you hear.
      </p>

      <h2 className={LEARN_STYLES.h2}>
        <Link href="/learn/approach/chromatic-circle" className={LEARN_STYLES.link}>
          The Chromatic Circle
        </Link>
        <LearnTags tags={[LearnTag.Geometry]} />
      </h2>
      <p>
        Why a circle instead of a line makes intervals and inversions easier to see - and how
        that&apos;s different from the circle of fifths.
      </p>

      <h2 className={LEARN_STYLES.h2}>
        <Link href="/learn/approach/what-the-wheel-shows" className={LEARN_STYLES.link}>
          What the Wheel Shows
        </Link>
      </h2>
      <p>
        The same intervals, chords, progressions and scales from What&apos;s Useful About Music
        Theory, this time drawn on the wheel instead of written on the staff.
      </p>

      <h2 className={LEARN_STYLES.h2}>Reference</h2>
      <p>Supporting detail for the sequence above, not part of its path.</p>

      <h2 className={LEARN_STYLES.h2}>
        <Link href="/learn/approach/color-coding" className={LEARN_STYLES.link}>
          Color Coding
        </Link>
        <LearnTags tags={[LearnTag.Geometry]} />
      </h2>
      <p>What the colors on the wheel, the ribbon, and every legend actually mean.</p>

      <h2 className={LEARN_STYLES.h2}>
        <Link href="/learn/approach/accidentals" className={LEARN_STYLES.link}>
          Accidentals
        </Link>
      </h2>
      <p>
        Why the keyboard plays down sharps and flats, resolves a real spelling once you&apos;re in
        a key, and never shows a double sharp or double flat.
      </p>
    </>
  );
}
