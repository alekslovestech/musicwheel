import type { Metadata } from "next";
import Link from "next/link";

import { ComparisonGrid2 } from "@/components/Learn/layout/ComparisonGrid";
import { ProgressionStaff } from "@/components/Learn/figures/ProgressionStaff";
import { ScaleFigure } from "@/components/Learn/figures/ScaleFigure";
import { SpelledStaff } from "@/components/Learn/figures/SpelledStaff";
import { LEARN_STYLES } from "@/lib/design";
import {
  C_MAJOR_TRIAD,
  C_TO_E,
  E_MAJOR_TRIAD,
  E_TO_G_SHARP,
} from "@/lib/learn/spelledFigures";
import { learnViewMetadata, metadataForSlugPage } from "@/lib/metadata";
import { ChordProgressionType } from "@/types/enums/ChordProgressionType";
import { ScaleModeType } from "@/types/enums/ScaleModeType";

export const metadata: Metadata = metadataForSlugPage(
  learnViewMetadata,
  "/learn/approach/whats-useful-about-music-theory",
  "What's Useful About Music Theory",
  "The parts of music theory worth keeping: terms for intervals, chords, progressions and scales that describe what you hear, whatever the spelling, key or instrument.",
  {
    slug: "whats-useful-about-music-theory",
    alt: "Terms and concepts of music theory that don't depend on notation, key or instrument",
  },
);

export default function WhatsUsefulAboutMusicTheoryPage() {
  return (
    <>
      <Link href="/learn/approach" className={LEARN_STYLES.link}>
        ← Approach
      </Link>

      <h1 className={LEARN_STYLES.h1}>What&apos;s Useful About Music Theory</h1>

      <p>
        Most Western music divides the octave into 12 evenly spaced notes, a tuning known as 12
        equal divisions of the octave (12 EDO). After 12 notes we reach a new octave and the pattern
        repeats. Many of music theory&apos;s concepts are built on this division; below are some of
        the more useful ones, which depend on neither how the music is notated nor the key
        it&apos;s in.
      </p>

      <h2 className={LEARN_STYLES.h2}>Intervals</h2>

      <p>
        An interval is the distance between 2 notes, and each distance has its own term.
      </p>

      <p>
        Take the <i>major 3rd</i>, starting on 2 different notes:
      </p>

      <ComparisonGrid2>
        <SpelledStaff {...C_TO_E} caption="C–E" />
        <SpelledStaff {...E_TO_G_SHARP} caption="E–G♯" />
      </ComparisonGrid2>

      <p>
        On the staff they sit on different lines, and one has a ♯. To the ear they&apos;re the same
        interval.
      </p>

      <h2 className={LEARN_STYLES.h2}>Chords</h2>

      <p>
        A chord is a stack of intervals, and its term describes that stack. A <i>major chord</i> is a{" "}
        <i>triad</i>: a <i>major 3rd</i> (4 semitones) with a <i>minor 3rd</i> (3) on top, from any
        starting note, and it&apos;s still the same chord when its notes are rearranged (an{" "}
        <Link href="/learn/chords/triad-inversions" className={LEARN_STYLES.link}>
          inversion
        </Link>
        ).
      </p>

      <ComparisonGrid2>
        <SpelledStaff {...C_MAJOR_TRIAD} caption="C major" />
        <SpelledStaff {...E_MAJOR_TRIAD} caption="E major" />
      </ComparisonGrid2>

      <h2 className={LEARN_STYLES.h2}>Chord progressions</h2>

      <p>
        A chord progression is a sequence of chords, and it&apos;s what you recognize when you
        hear the same song in a different key. The chords below are different, but the progression
        is the same ii–V–I. The{" "}
        <Link href="/learn/chords/roman-numerals" className={LEARN_STYLES.link}>
          Roman numerals
        </Link>{" "}
        are a handy way to write it down: each one names a chord by its place in the key, not by its
        letter.
      </p>

      <ComparisonGrid2>
        <ProgressionStaff
          tonic="C"
          progression={ChordProgressionType.Two_Five_One}
          caption=""
        />
        <ProgressionStaff
          tonic="D"
          progression={ChordProgressionType.Two_Five_One}
          caption=""
        />
      </ComparisonGrid2>

      <h2 className={LEARN_STYLES.h2}>Scales</h2>

      <p>
        A scale is a pattern of gaps between notes, and each pattern has its own sound, whatever
        note it starts on.
      </p>

      <ComparisonGrid2>
        <ScaleFigure
          tonic="C"
          scaleType={ScaleModeType.Dorian}
          caption="C Dorian"
          views={["staff", "linear"]}
          isCompact
          hasKeySignature={false}
        />
        <ScaleFigure
          tonic="C"
          scaleType={ScaleModeType.Lydian}
          caption="C Lydian"
          views={["staff", "linear"]}
          isCompact
          hasKeySignature={false}
        />
      </ComparisonGrid2>

      <h2 className={LEARN_STYLES.h2}>Go deeper</h2>

      <ul className="list-disc pl-6">
        <li>
          <Link href="/learn/approach/chromatic-circle" className={LEARN_STYLES.link}>
            The Chromatic Circle
          </Link>
          : intervals as distances
        </li>
        <li>
          <Link href="/learn/chords/chord-quality" className={LEARN_STYLES.link}>
            Chord Quality
          </Link>
          : the full set of chord types
        </li>
        <li>
          <Link href="/learn/scales" className={LEARN_STYLES.link}>
            Scales
          </Link>
          : how the patterns relate to each other
        </li>
      </ul>

      <h2 className={LEARN_STYLES.h2}>About this approach</h2>

      <ul className="list-disc pl-6">
        <li>
          <Link href="/learn/approach/why-this-app" className={LEARN_STYLES.link}>
            Why This App
          </Link>
          : how the app is built around these ideas
        </li>
        <li>
          <Link href="/learn/approach/color-coding" className={LEARN_STYLES.link}>
            Color Coding
          </Link>
          : what the colors show
        </li>
        <li>
          <Link href="/learn/approach/whats-wrong-with-music-theory" className={LEARN_STYLES.link}>
            What&apos;s Wrong with Music Theory
          </Link>
          : the terms that depend on notation instead
        </li>
      </ul>
    </>
  );
}
