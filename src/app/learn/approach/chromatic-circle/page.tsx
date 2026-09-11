import type { Metadata } from "next";
import Link from "next/link";

import { LEARN_STYLES } from "@/lib/design";
import { learnViewMetadata, metadataForSlugPage } from "@/lib/metadata";
import { StaticChordFigure } from "@/components/Learn/StaticChordFigure";
import { SpecialType } from "@/types/enums/SpecialType";

export const metadata: Metadata = metadataForSlugPage(
  learnViewMetadata,
  "/learn/approach/chromatic-circle",
  "The Chromatic Circle",
  "Why arranging the twelve notes in a circle instead of a line makes intervals and inversions easier to see - and how that's different from the circle of fifths.",
);

export default function ChromaticCirclePage() {
  return (
    <>
      <Link href="/learn/approach" className={LEARN_STYLES.link}>
        ← Approach
      </Link>

      <h1 className="text-3xl font-semibold">The Chromatic Circle</h1>

      <p>
        A keyboard or a staff lays the twelve notes out in a line, which is a reasonable way to
        show pitch going up, but it comes with a built-in edge: the line has to stop somewhere and
        start again an octave later, so two notes that are musically right next to each other - a B
        and the C above it, or the top and bottom of any octave - end up drawn far apart, on
        opposite sides of a seam. The chromatic circle just closes that seam. Twelve notes, evenly
        spaced, wrapping back into the tonic where they started - there is no top or bottom, no
        seam, and no direction that&apos;s privileged over any other.
      </p>

      <h2 className="text-xl font-semibold">Intervals as distance, not as a seam to cross</h2>
      <StaticChordFigure
          rootNote="C"
          chordType={SpecialType.None}
          inversionIndex={0}
          caption="The Chromatic Circle as it relates to the piano keyboard"
          isCompact = {true}    
          showNoteLabels = {true}
          showAccidentalMarks = {true}      
        />
      <p>
        Once pitch is arranged this way, an interval stops being &ldquo;a number of letter-names
        apart&rdquo; and becomes what it actually is: an angular distance between two points on a
        circle. That distance is the same wherever the two points happen to sit - a minor third
        looks like a minor third whether it&apos;s C to E♭ or F♯ to A, because it&apos;s the same
        arc, just rotated. Nothing about it changes shape depending on which key you&apos;re in, the
        way the same interval can look visually different in different positions on a keyboard or a
        staff.
      </p>

      <p>
        It also makes interval inversion obvious instead of something to memorize. Any two notes cut
        the circle into two arcs - the interval going one way around, and its complement going the
        other. A minor second and a major seventh aren&apos;t two unrelated facts you happen to
        learn add up to twelve semitones; they&apos;re visibly the same two points, read around the
        circle in the two possible directions. That&apos;s the same idea{" "}
        <Link href="/learn/approach/color-coding" className={LEARN_STYLES.link}>
          the color coding
        </Link>{" "}
        is built on - a minor second and a major seventh share a color because the circle treats
        them as the same relationship, just measured the other way.
      </p>

      <h2 className="text-xl font-semibold">Chord inversions as a marker, not a reshuffle</h2>

      <p>
        Chord inversion gets the same clarity. On a staff, root position, first inversion, and
        second inversion of a triad are three different-looking clusters of notes, because the notes
        get physically rearranged in pitch order as the bass changes. On the circle, nothing moves:
        it&apos;s the same three wedges lit up the entire time, in every inversion - see{" "}
        <Link href="/learn/triad-inversions" className={LEARN_STYLES.link}>
          Triad Inversions
        </Link>
        . Only a small dot marking the bass note moves from wedge to wedge. That&apos;s the whole
        content of &ldquo;inversion&rdquo;: the chord never changed, only which note you&apos;re
        calling the bottom did.
      </p>

      <h2 className="text-xl font-semibold">The circle of fifths is a different circle</h2>

      <p>
        The circle of fifths also arranges all twelve notes into a loop, and the two are related -
        stepping around the circle of fifths by one position is the same as stepping seven positions
        around the chromatic circle, so one is really just a relabeling of the same twelve points in
        a different order. But that reordering trades away the very property the chromatic circle is
        built around: on the circle of fifths, neighboring positions are a fifth apart, not a
        semitone apart, so physical closeness on the page no longer means the notes sound close
        together. It&apos;s a genuinely useful picture for a different question - how many
        accidentals separate two key signatures, or which keys share the most notes - not for
        seeing what an interval or a chord inversion actually is. Reach for the circle of fifths for
        key relationships; reach for the chromatic circle, and the wheel this app is built around,
        for everything about how notes and chords relate to each other by ear.
      </p>
    </>
  );
}
