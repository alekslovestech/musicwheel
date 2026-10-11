import type { Metadata } from "next";
import Link from "next/link";

import { StaticChordFigure } from "@/components/Learn/StaticChordFigure";
import { LEARN_STYLES } from "@/lib/design";
import { learnViewMetadata, metadataForSlugPage } from "@/lib/metadata";
import { ChordType } from "@/types/enums/ChordType";
import { IntervalType } from "@/types/enums/IntervalType";

export const metadata: Metadata = metadataForSlugPage(
  learnViewMetadata,
  "/learn/approach/why-this-app",
  "Why This App",
  "The problems this app is trying to solve: which parts of music theory actually matter for hearing harmony, and which parts are historical noise.",
);

export default function WhyThisAppPage() {
  return (
    <>
      <Link href="/learn/approach" className={LEARN_STYLES.link}>
        ← Approach
      </Link>

      <h1 className={LEARN_STYLES.h1}>Why This App</h1>

      <p>
        <Link href="/learn/approach/whats-wrong-with-music-theory" className={LEARN_STYLES.link}>
          What&apos;s Wrong with Music Theory
        </Link>{" "}
        covers the parts of theory that are about notation rather than sound. This page is about
        the rest - the parts that describe harmony itself, which is what this app is built around.
      </p>

      <h2 className={LEARN_STYLES.h2}>12 equal notes</h2>

      <p>
        We show a piano for reference, because it&apos;s a familiar layout and a convenient way to
        play a sound back. But the arrangement of black and white keys doesn&apos;t explain the
        harmony, and understanding a chord doesn&apos;t require a piano, or any instrument at all.
      </p>

      <h2 className={LEARN_STYLES.h2}>Intervals are distances</h2>

      <p>
        Intervals and chord quality are a small, useful vocabulary for what you&apos;re hearing. Terms like
        &ldquo;Minor 3rd,&rdquo; &ldquo;Perfect 5th,&rdquo; &ldquo;dominant 7th&rdquo; are worth
        knowing because they name something about the sound, not about how it's written.
      </p>

      <p>
        An interval is a number of semitones. The notes of a Major 3rd are always the same "distance" from each other. 
      </p>

      <div className="mx-auto w-full max-w-sm">
        <StaticChordFigure
          rootNote="C"
          chordType={IntervalType.Major3}
          inversionIndex={0}
          isCompact={true}
          caption="C–E or C–F♭: one picture, 4 semitones"
        />
      </div>

      <h2 className={LEARN_STYLES.h2}>Keys don&apos;t change the harmony</h2>

      <p>
        A chord sounds the same whatever key it&apos;s in, so on the wheel it looks the same too -
        no key signature to work against, no naturals to cancel it. The same goes for chord
        progressions: a ii-V-I is the same shape whether it starts on C or on F♯.
      </p>

      <div className="mx-auto w-full max-w-sm">
        <StaticChordFigure
          rootNote="C"
          chordType={ChordType.Major}
          inversionIndex={0}
          isCompact={true}
          caption="C major, whatever key it's in"
        />
      </div>

      <h2 className={LEARN_STYLES.h2}>See the pattern, don&apos;t recite it</h2>

      <p>
        Scale names - Dorian, harmonic minor, and the rest - are shorthand for specific,
        recognizable patterns of semitones. Worth learning the pattern; see{" "}
        <Link href="/learn/scales" className={LEARN_STYLES.link}>
          Scales
        </Link>{" "}
        for how they relate to each other.
      </p>

      <p>
        The wheel arranges and colors notes by distance, so a relationship you can hear shows up as
        one you can see. See{" "}
        <Link href="/learn/approach/chromatic-circle" className={LEARN_STYLES.link}>
          The Chromatic Circle
        </Link>{" "}
        for how it works, and{" "}
        <Link href="/learn/approach/color-coding" className={LEARN_STYLES.link}>
          Color Coding
        </Link>{" "}
        for the colors.
      </p>
    </>
  );
}
