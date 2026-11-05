import type { Metadata } from "next";
import Link from "next/link";

import { ArticleNav } from "@/components/Learn/prose/ArticleNav";
import { ComparisonGrid2 } from "@/components/Learn/layout/ComparisonGrid";
import { ProgressionStaff } from "@/components/Learn/figures/ProgressionStaff";
import { ScaleFigure } from "@/components/Learn/figures/ScaleFigure";
import { SeeAlso } from "@/components/Learn/prose/SeeAlso";
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
        repeats.
      </p>

      <h2 className={LEARN_STYLES.h2}>Intervals</h2>

      <p>
        An interval is the distance between 2 notes, and each distance has its own term.
      </p>

      <p>
        Take the <i>major third</i> interval, starting on 2 different notes:
      </p>

      <ComparisonGrid2>
        <SpelledStaff {...C_TO_E} caption="C–E" />
        <SpelledStaff {...E_TO_G_SHARP} caption="E–G♯" />
      </ComparisonGrid2>

      <p>
        On the staff they sit on different lines, and one has a sharp (♯) next to it - but to the ear they&apos;re the same
        interval, with the same bright, settled sound.
      </p>

      <h2 className={LEARN_STYLES.h2}>Chords</h2>

      <p>
        A chord is a stack of intervals, and its term describes that stack. A <i>major chord</i> is
        a triad - 3 notes, built from 2 intervals:
      </p>

      <ul className="list-disc pl-6">
        <li>
          a <i>major third</i> (4 semitones) from the bottom note to the middle one
        </li>
        <li>
          a <i>minor third</i> (3 semitones) from the middle note to the top
        </li>
      </ul>

      <p>Start on any note, and the same stack gives you a major chord.</p>

      <ComparisonGrid2>
        <SpelledStaff {...C_MAJOR_TRIAD} caption="C major" />
        <SpelledStaff {...E_MAJOR_TRIAD} caption="E major" />
      </ComparisonGrid2>

      <p>
        Again the staff makes them look different - the E major needs a ♯, while the C major doesn&apos;t - but both have the
        same bright, stable sound of a <i>major chord</i>.
      </p> 

      <h2 className={LEARN_STYLES.h2}>Chord progressions</h2>

      <p>
        A chord progression is a sequence of chords, and it&apos;s what you recognize when you
        hear the same song in a different key. The chords below are different, but the progression
        is the same ii–V–I. That name works in any key because each number names a chord by its
        place in the key, not by its letter.
      </p>

      <ComparisonGrid2>
        <ProgressionStaff
          tonic="C"
          progression={ChordProgressionType.Two_Five_One}
          caption=""
          showAppLink={false}
        />
        <ProgressionStaff
          tonic="D"
          progression={ChordProgressionType.Two_Five_One}
          caption=""
          showAppLink={false}
        />
      </ComparisonGrid2>

      <p>
        The notes and the accidentals change; the pull back home on the final chord doesn&apos;t.
      </p>

      <h2 className={LEARN_STYLES.h2}>Scales</h2>

      <p>
        A scale is a pattern of gaps between notes, and each pattern has its own sound, whatever
        note it starts on.
      </p>

      <ScaleFigure
        tonic="C"
        scaleType={ScaleModeType.Dorian}
        caption="C Dorian"
        views={["staff", "linear"]}
        isCompact
        hasKeySignature={false}
        showAppLink={false}
      />
      <ScaleFigure
        tonic="C"
        scaleType={ScaleModeType.Lydian}
        caption="C Lydian"
        views={["staff", "linear"]}
        isCompact
        hasKeySignature={false}
        showAppLink={false}
      />

      <p>
        Same starting note, different pattern, different mood: C <i>Dorian</i> sounds darker, C{" "}
        <i>Lydian</i> brighter and floating. On the staff, that whole difference comes down to a few
        small accidentals that are easy to miss.
      </p>

      <h2 className={LEARN_STYLES.h2}>The common thread</h2>

      <p>
        Intervals, chords, progressions, and scales each carry a character you can learn to hear,
        in any key. Their names are worth knowing for exactly that reason. What standard notation
        does poorly is show those characters: it records which notes to play, and leaves the shapes
        behind them for you to work out. A way of seeing harmony that showed those shapes directly
        would make them far easier to learn.
      </p>

      <SeeAlso
        items={["chord-quality", "triad-inversions", "roman-numerals", "scales", "color-coding"]}
      />

      <ArticleNav id="whats-useful-about-music-theory" />
    </>
  );
}
