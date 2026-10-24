import type { Metadata } from "next";
import Link from "next/link";

import { ChordWheel } from "@/components/Learn/figures/ChordWheel";
import { LEARN_STYLES } from "@/lib/design";
import { learnViewMetadata, metadataForSlugPage } from "@/lib/metadata";
import { ChordType } from "@/types/enums/ChordType";
import { IntervalType } from "@/types/enums/IntervalType";

export const metadata: Metadata = metadataForSlugPage(
  learnViewMetadata,
  "/learn/approach/why-this-app",
  "Why This App",
  "How the useful parts of music theory shaped the app: a circle of 12 notes, distance shown as position and color, chords as shapes, and keys as rotation.",
);

export default function WhyThisAppPage() {
  return (
    <>
      <Link href="/learn/approach" className={LEARN_STYLES.link}>
        ← Approach
      </Link>

      <h1 className={LEARN_STYLES.h1}>Why This App</h1>

      <p>
        <Link href="/learn/approach/whats-useful-about-music-theory" className={LEARN_STYLES.link}>
          What&apos;s Useful About Music Theory
        </Link>{" "}
        lists the parts of theory that describe sound. Each one shaped a decision about how this app
        draws harmony.
      </p>

      <h2 className={LEARN_STYLES.h2}>A circle, not a keyboard</h2>

      <p>
        There are 12 equal notes and the pattern repeats every octave, so the wheel places them
        evenly around a circle. We also show a piano, because it&apos;s a familiar layout and a
        convenient way to play a sound back - but its arrangement of black and white keys
        doesn&apos;t explain the harmony. See{" "}
        <Link href="/learn/approach/chromatic-circle" className={LEARN_STYLES.link}>
          The Chromatic Circle
        </Link>{" "}
        for why a circle beats a line.
      </p>

      <h2 className={LEARN_STYLES.h2}>Distance you can see</h2>

      <p>
        Intervals are distances, so the wheel shows them as distances: 2 notes a <i>major 3rd</i>{" "}
        apart are always the same angle apart, wherever they sit.
      </p>

      <div className="mx-auto w-full max-w-sm">
        <ChordWheel
          rootNote="C"
          chordType={IntervalType.Major3}
          inversionIndex={0}
          isCompact={true}
          caption="C–E: major 3rd, 4 semitones"
        />
      </div>

      <h2 className={LEARN_STYLES.h2}>Color, so you don&apos;t have to count</h2>

      <p>
        The chromatic circle is an established idea; the color coding is this app&apos;s own
        addition. Each kind of interval gets its own color, so you can recognize a <i>major 3rd</i>{" "}
        at a glance instead of counting the semitones between its notes. Chords blend the colors of
        the intervals inside them. See{" "}
        <Link href="/learn/approach/color-coding" className={LEARN_STYLES.link}>
          Color Coding
        </Link>{" "}
        for how the colors are assigned.
      </p>

      <h2 className={LEARN_STYLES.h2}>Chords are polygons</h2>

      <p>
        A chord is a shape made of intervals, so on the wheel it&apos;s literally a shape. Every{" "}
        <i>major triad</i> is the same triangle; every <i>minor triad</i> is that triangle flipped.
        Chord quality becomes something you recognize at a glance.
      </p>

      <div className="mx-auto w-full max-w-sm">
        <ChordWheel
          rootNote="C"
          chordType={ChordType.Major}
          inversionIndex={0}
          isCompact={true}
          caption="C major: the major-triad triangle"
        />
      </div>

      <h2 className={LEARN_STYLES.h2}>Keys rotate, they don&apos;t respell</h2>

      <p>
        Transposing doesn&apos;t change any relationship, so changing key on the wheel just rotates
        the shape. There&apos;s no key signature to work against and no naturals to cancel it, and a
        ii-V-I traces the same path whether it starts on C or on F♯.
      </p>

      <h2 className={LEARN_STYLES.h2}>Spelling stays out of the way</h2>

      <p>
        Since G♯ and A♭ sound the same, the app does not focus on the spelling aspect, but rather
        uses it for reference and familiarity. See{" "}
        <Link href="/learn/approach/accidentals" className={LEARN_STYLES.link}>
          Accidentals
        </Link>{" "}
        for the details.
      </p>

      <h2 className={LEARN_STYLES.h2}>Hear it as you build it</h2>

      <p>
        Recognition comes from hearing, not from reading. Everything you build in the app can be
        played, so each shape on the wheel gets connected to the sound it makes.
      </p>
    </>
  );
}
