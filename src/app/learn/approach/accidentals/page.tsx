import type { Metadata } from "next";
import Link from "next/link";

import { LEARN_STYLES } from "@/lib/design";
import { learnViewMetadata, metadataForSlugPage } from "@/lib/metadata";
import { StaticChordFigure } from "@/components/Learn/StaticChordFigure";
import { SpecialType } from "@/types/enums/SpecialType";

export const metadata: Metadata = metadataForSlugPage(
  learnViewMetadata,
  "/learn/approach/accidentals",
  "Accidentals",
  "Why the app plays down sharps and flats on the keyboard, resolves a real spelling once you're in a key, and never once shows a double sharp or double flat.",
);

export default function AccidentalsPage() {
  return (
    <>
      <Link href="/learn/approach" className={LEARN_STYLES.link}>
        ← Approach 
      </Link>

      <h1 className={LEARN_STYLES.h1}>Accidentals ♯/♭</h1>

      <p>
        Is it a C♯ or a D♭? Or even a C♯/D♭? What labels should we put on the black keys? The
        musical theory answer is &ldquo;well it depends&rdquo;. Which key are you in? What scale
        degree is it? What chord is it part of? These are the kinds of questions we are trying to
        spend <i>less</i> time on. What we want to know instead is &ldquo;how does it sound&rdquo;,
        what is the &ldquo;quality&rdquo; of this chord, etc. This app&apos;s approach is to{" "}
        <i>downplay</i> the accidentals. The first black key of the linear keyboard is just in
        between a C♯ and a D♭, and you can put whatever label on it you want mentally. We take a
        similar approach to the chromatic circle.
      </p>
      <StaticChordFigure
        rootNote="C"
        chordType={SpecialType.None}
        inversionIndex={0}
        caption="Accidentals (♯/♭) are downplayed"
        isCompact={true}
        showLabels={true}
      />

      <h2 className={LEARN_STYLES.h2}>No key selected: position instead of spelling</h2>

      <p>
        Outside of a scale or chord progression, a black key on the wheel or the keyboard carries no
        letter at all. You see it sitting between C and D - which is the actual fact about it -
        instead of being told it&apos;s &ldquo;really&rdquo; C♯ or &ldquo;really&rdquo; D♭. Neither
        is more correct than the other here, so rather than guess, the app just doesn&apos;t claim
        one.
      </p>

      <h2 className={LEARN_STYLES.h2}>Inside a key: a real spelling, degree by degree</h2>

      <p>
        Once a key is selected, there&apos;s enough context to do better than a shrug. Standard
        spelling assigns each scale degree its own letter, cycling once through A-G as you climb the
        scale, so the app follows that same rule: C Phrygian&apos;s ♭2 is spelled D♭, not C♯,
        because the 2nd degree has to be some kind of D. That&apos;s a real piece of theory worth
        keeping - it&apos;s what makes a scale&apos;s spelling readable as a run of consecutive
        letters instead of a jumble.
      </p>

      <h2 className={LEARN_STYLES.h2}>But never a double accidental</h2>

      <p>
        Push the letter-cycling rule far enough and it demands a double accidental. A fully
        diminished 7th stacks minor 3rds all the way up, so strict spelling of C dim7 is C, E♭, G♭,
        B𝄫 - not the A you&apos;d actually play. That&apos;s standard notation, and here the app
        breaks with it: its accidental type only has natural, sharp, and flat, so it falls back to
        the plain single-accidental name (A) instead. You will never see a double sharp or double
        flat in this app, however standard one might be on paper.
      </p>

      <p>
        See{" "}
        <Link href="/learn/approach/whats-wrong-with-music-theory" className={LEARN_STYLES.link}>
          What&apos;s Wrong with Music Theory
        </Link>{" "}
        for why that trade is worth making, and{" "}
        <Link href="/learn/approach/chromatic-circle" className={LEARN_STYLES.link}>
          The Chromatic Circle
        </Link>{" "}
        for the bigger idea it&apos;s part of - drawing harmony by distance rather than by letter.
      </p>
    </>
  );
}
