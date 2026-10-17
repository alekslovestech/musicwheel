import type { Metadata } from "next";
import Link from "next/link";

import { ComparisonGrid2 } from "@/components/Learn/ComparisonGrid";
import { StaticStaffFigure } from "@/components/Learn/StaticStaffFigure";
import { LEARN_STYLES } from "@/lib/design";
import { C_MAJOR_TRIAD, C_TO_E, E_MAJOR_TRIAD, E_TO_G_SHARP } from "@/lib/learn/staffFigures";
import { learnViewMetadata, metadataForSlugPage } from "@/lib/metadata";

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
        of labeling them, not a property of the notes themselves.
      </p>

      <h2 className={LEARN_STYLES.h2}>Intervals are distances</h2>

      <p>
        An interval is the distance between 2 notes, counted in semitones. Names like{" "}
        <i>minor 3rd</i> (3 semitones), <i>major 3rd</i> (4) and <i>perfect 5th</i> (7) are worth
        knowing, because each one names a distinct sound - and that sound is the same wherever the
        interval starts.
      </p>

      <ComparisonGrid2>
        <StaticStaffFigure
          {...C_TO_E}
          caption="C–E: major 3rd, 4 semitones"
        />
        <StaticStaffFigure
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
        <StaticStaffFigure
          {...C_MAJOR_TRIAD}
          caption="C major: 4 + 3 semitones"
        />
        <StaticStaffFigure
          {...E_MAJOR_TRIAD}
          caption="E major: 4 + 3 semitones"
        />
      </ComparisonGrid2>

      <h2 className={LEARN_STYLES.h2}>Relationships survive transposition</h2>

      <p>
        Move every note of a chord or progression by the same number of semitones and nothing about
        how it works changes - only how high or low it sits. A ii-V-I in C and a ii-V-I in F♯ are
        the same progression. That&apos;s what makes{" "}
        <Link href="/learn/chords/roman-numerals" className={LEARN_STYLES.link}>
          Roman numerals
        </Link>{" "}
        useful: they name the relationship rather than the letters.
      </p>

      <h2 className={LEARN_STYLES.h2}>Scales are patterns</h2>

      <p>
        A scale is a selection from the 12 notes, defined by the gaps between them. <i>Dorian</i>
        ,&nbsp;<i>Phrygian</i>, <i>harmonic minor</i> etc., are names for specific gap patterns. See{" "}
        <Link href="/learn/scales" className={LEARN_STYLES.link}>
          Scales
        </Link>{" "}
        for how they relate to each other.
      </p>

      <h2 className={LEARN_STYLES.h2}>What it&apos;s for: recognizing what you hear</h2>

      <p>
        The point of the vocabulary is recognition. A <i>major</i> triad sounds bright and settled,
        a <i>minor</i> triad darker. A <i>dominant 7th</i> pulls toward the chord a 5th below it; a{" "}
        <i>diminished</i> chord is unstable and wants to move somewhere. A V-I sounds like arriving
        home.
      </p>

      <p>
        Once these sounds have names, you can hear a song and know what it&apos;s doing, play it
        back without guessing, and reach for a specific mood on purpose instead of by accident.
        That&apos;s the part of theory worth keeping.
      </p>

      <p>
        See{" "}
        <Link href="/learn/approach/why-this-app" className={LEARN_STYLES.link}>
          Why This App
        </Link>{" "}
        for how the app is built around these facts.
      </p>
    </>
  );
}
