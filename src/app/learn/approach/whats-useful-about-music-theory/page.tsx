import type { Metadata } from "next";
import Link from "next/link";

import { ComparisonGrid2 } from "@/components/Learn/layout/ComparisonGrid";
import { ProgressionStaff } from "@/components/Learn/figures/ProgressionStaff";
import { ScaleFigure } from "@/components/Learn/figures/ScaleFigure";
import { SpelledStaff } from "@/components/Learn/figures/SpelledStaff";
import { LEARN_STYLES } from "@/lib/design";
import { C_MAJOR_TRIAD, C_TO_E, E_MAJOR_TRIAD, E_TO_G_SHARP } from "@/lib/learn/spelledFigures";
import { learnViewMetadata, metadataForSlugPage } from "@/lib/metadata";
import { ChordProgressionType } from "@/types/enums/ChordProgressionType";
import { ScaleModeType } from "@/types/enums/ScaleModeType";

export const metadata: Metadata = metadataForSlugPage(
  learnViewMetadata,
  "/learn/approach/whats-useful-about-music-theory",
  "What's Useful About Music Theory",
  "The parts of music theory that describe sound: 12 equal notes, intervals as distances, chords as shapes, and the vocabulary for recognizing what you hear.",
);

export default function WhatsUsefulAboutMusicTheoryPage() {
  return (
    <>
      <Link href="/learn/approach" className={LEARN_STYLES.link}>
        ← Approach
      </Link>

      <h1 className={LEARN_STYLES.h1}>What&apos;s Useful About Music Theory</h1>

      <p>
        <Link href="/learn/approach/whats-wrong-with-music-theory" className={LEARN_STYLES.link}>
          What&apos;s Wrong with Music Theory
        </Link>{" "}
        covers the parts of theory that are about notation. Strip those away and what&apos;s left is
        small: a handful of facts about sound that hold on any instrument, in any key.
      </p>

      <h2 className={LEARN_STYLES.h2}>12 equal notes</h2>

      <p>
        An octave is divided into 12 evenly spaced notes, and after the 12th the pattern repeats.
        All of Western harmony is built by choosing among those 12. The 7 letter names are one way
        of labeling them, not a property of the notes themselves. Since they repeat, they fit
        naturally on a circle - see{" "}
        <Link href="/learn/approach/chromatic-circle" className={LEARN_STYLES.link}>
          The Chromatic Circle
        </Link>
        .
      </p>

      <h2 className={LEARN_STYLES.h2}>Intervals are distances</h2>

      <p>
        An interval is the distance between 2 notes, counted in semitones. Names like{" "}
        <i>minor 3rd</i> (3 semitones), <i>major 3rd</i> (4) and <i>perfect 5th</i> (7) are worth
        knowing, because each one names a distinct sound - and that sound is the same wherever the
        interval starts. See{" "}
        <Link href="/learn/interval-inversions" className={LEARN_STYLES.link}>
          Interval Inversions
        </Link>{" "}
        for what happens when you flip one.
      </p>

      <ComparisonGrid2>
        <SpelledStaff
          {...C_TO_E}
          caption="C–E: major 3rd, 4 semitones"
        />
        <SpelledStaff
          {...E_TO_G_SHARP}
          caption="E–G♯: major 3rd, 4 semitones"
        />
      </ComparisonGrid2>

      <h2 className={LEARN_STYLES.h2}>Chords are shapes</h2>

      <p>
        A chord is a stack of intervals above a root. A <i>major triad</i> is a <i>major 3rd</i>{" "}
        with a <i>minor 3rd</i> on top; a <i>minor triad</i> swaps the two. Chord quality -{" "}
        <i>major</i>, <i>minor</i>, <i>diminished</i>, <i>dominant 7th</i> - is the name for that
        shape, and it&apos;s what you actually hear. See{" "}
        <Link href="/learn/chords/chord-quality" className={LEARN_STYLES.link}>
          Chord Quality
        </Link>{" "}
        for the full set.
      </p>

      <ComparisonGrid2>
        <SpelledStaff
          {...C_MAJOR_TRIAD}
          caption="C major: 4 + 3 semitones"
        />
        <SpelledStaff
          {...E_MAJOR_TRIAD}
          caption="E major: 4 + 3 semitones"
        />
      </ComparisonGrid2>

      <h2 className={LEARN_STYLES.h2}>Scales are patterns</h2>

      <p>
        A scale is a selection from the 12 notes, defined by the gaps between them. <i>Dorian</i>
        ,&nbsp;<i>Phrygian</i>, <i>harmonic minor</i> etc., are names for specific gap patterns. See{" "}
        <Link href="/learn/scales" className={LEARN_STYLES.link}>
          Scales
        </Link>{" "}
        for how they relate to each other.
      </p>

      <div className="mx-auto w-full max-w-xl">
        <ScaleFigure
          tonic="C"
          scaleType={ScaleModeType.MelodicMinor}
          caption="C melodic minor"
          views={["staff", "linear"]}
          isCompact
        />
      </div>

      <h2 className={LEARN_STYLES.h2}>Progressions are relationships</h2>

      <p>
        Move every note of a chord or progression by the same number of semitones and nothing about
        how it works changes - only how high or low it sits. That&apos;s why we hear &ldquo;the same
        song&rdquo; in any key. The 2-5-1 below uses different chords in C and in D, but the same
        pattern, which{" "}
        <Link href="/learn/chords/roman-numerals" className={LEARN_STYLES.link}>
          Roman numerals
        </Link>{" "}
        name by each chord&apos;s place in the key.
      </p>

      <ComparisonGrid2>
        <ProgressionStaff
          tonic="C"
          progression={ChordProgressionType.Two_Five_One}
          caption="The 2-5-1 in C major"
          showRomanNumerals={false}
        />
        <ProgressionStaff
          tonic="D"
          progression={ChordProgressionType.Two_Five_One}
          caption="The 2-5-1 in D major"
          showRomanNumerals={false}
        />
      </ComparisonGrid2>

      <p>
        See{" "}
        <Link href="/learn/approach/why-this-app" className={LEARN_STYLES.link}>
          Why This App
        </Link>{" "}
        for how the app is built around these facts, and{" "}
        <Link href="/learn/approach/color-coding" className={LEARN_STYLES.link}>
          Color Coding
        </Link>{" "}
        for what its colors show.
      </p>
    </>
  );
}
