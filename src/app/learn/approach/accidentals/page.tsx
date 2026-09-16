import type { Metadata } from "next";
import Link from "next/link";

import { LEARN_STYLES } from "@/lib/design";
import { learnViewMetadata, metadataForSlugPage } from "@/lib/metadata";

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

      <h1 className={LEARN_STYLES.h1}>Accidentals</h1>

      <p>
        A black key is one pitch, but standard notation makes you name it twice before you can
        write it down - C-sharp or D-flat, pick one. That choice is a fact about spelling, not
        about sound, so the app treats it as optional rather than mandatory, and resolves it
        differently depending on how much context it actually has.
      </p>

      <h2 className={LEARN_STYLES.h2}>No key selected: position instead of spelling</h2>

      <p>
        Outside of a scale or chord progression, a black key on the wheel or the keyboard carries
        no letter at all. You see it sitting between C and D - which is the actual fact about it -
        instead of being told it&apos;s &ldquo;really&rdquo; C-sharp or &ldquo;really&rdquo;
        D-flat. Neither is more correct than the other here, so rather than guess, the app just
        doesn&apos;t claim one.
      </p>

      <h2 className={LEARN_STYLES.h2}>Inside a key: a real spelling, degree by degree</h2>

      <p>
        Once a key is selected, there&apos;s enough context to do better than a shrug. Standard
        spelling assigns each scale degree its own letter, cycling once through A-G as you climb
        the scale, so the app follows that same rule: C Phrygian&apos;s flat 2nd is spelled D-flat,
        not C-sharp, because the 2nd degree has to be some kind of D. That&apos;s a real piece of
        theory worth keeping - it&apos;s what makes a scale&apos;s spelling readable as a run of
        consecutive letters instead of a jumble.
      </p>

      <h2 className={LEARN_STYLES.h2}>But never a double accidental</h2>

      <p>
        Push that letter-cycling rule far enough - an exotic scale, an unusual degree - and it can
        demand a double sharp or double flat: some letter pushed two semitones from natural,
        because the &ldquo;correct&rdquo; letter for that degree is two steps off from the pitch
        that&apos;s actually sounding. The app doesn&apos;t follow the rule that far. There isn&apos;t
        even a way to represent one internally - the app&apos;s accidental type only has natural,
        sharp, and flat, full stop - so when the strict spelling would need a double accidental,
        the app falls back to the plain, single-accidental letter name for that pitch instead. You
        will never see a double sharp or a double flat in this app, no matter how &ldquo;correct&rdquo;
        it would be on paper.
      </p>

      <p>
        Same principle throughout, at three different levels of context: no key, no claim; a key,
        a real spelling; but never spelling correctness bought at the price of a symbol nobody
        needs. See{" "}
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
