import type { Metadata } from "next";
import Link from "next/link";

import { ArticlePage } from "@/components/Learn/layout/ArticlePage";
import { ComparisonGrid2 } from "@/components/Learn/layout/ComparisonGrid";
import { ChordWheel } from "@/components/Learn/figures/ChordWheel";
import { ProgressionFigure } from "@/components/Learn/figures/ProgressionFigure";
import { ScaleFigure } from "@/components/Learn/figures/ScaleFigure";
import { LEARN_STYLES } from "@/lib/design";
import { learnViewMetadata, metadataForSlugPage } from "@/lib/metadata";
import { ChordProgressionType } from "@/types/enums/ChordProgressionType";
import { ChordType } from "@/types/enums/ChordType";
import { IntervalType } from "@/types/enums/IntervalType";
import { ScaleModeType } from "@/types/enums/ScaleModeType";

export const metadata: Metadata = metadataForSlugPage(
  learnViewMetadata,
  "/learn/approach/music-theory-on-the-chromatic-circle",
  "Music Theory on the Chromatic Circle",
  "Intervals, chords, progressions and scales drawn as shapes on the chromatic circle, where each looks the same wherever it starts.",
);

export default function MusicTheoryOnTheChromaticCirclePage() {
  return (
    <ArticlePage
      id="music-theory-on-the-chromatic-circle"
      seeAlso={["color-coding", "symmetry-and-dissonance", "accidentals"]}
    >
      <h1 className={LEARN_STYLES.h1}>Music Theory on the Chromatic Circle</h1>

      <p>
        Intervals, chords, progressions and scales each have a shape that stays the same wherever
        it starts. Put the 12 notes of an octave around a circle, and each of these becomes a
        shape you can see. A shape moved to a new starting note is rotated, never changed. (The{" "}
        <Link href="/learn/approach/chromatic-circle" className={LEARN_STYLES.link}>
          chromatic circle
        </Link>{" "}
        covers how the wheel is built.)
      </p>

      <h2 className={LEARN_STYLES.h2}>Intervals</h2>

      <p>
        A <i>major third</i>&nbsp;starting on C and one starting on E&nbsp;-&nbsp;the same angle, just
        rotated:
      </p>

      <ComparisonGrid2>
        <ChordWheel
          rootNote="C"
          chordType={IntervalType.Major3}
          inversionIndex={0}
          caption="C–E"
          isCompact
        />
        <ChordWheel
          rootNote="E"
          chordType={IntervalType.Major3}
          inversionIndex={0}
          caption="E–G♯"
          isCompact
        />
      </ComparisonGrid2>

      <p>Both intervals are 4 semitones, and on the wheel the 2 shapes are identical.</p>

      <h2 className={LEARN_STYLES.h2}>Chords</h2>

      <p>
        Stack 2 intervals and you have a chord. A <i>major third</i> (4 semitones) with a{" "}
        <i>minor third</i> (3 semitones) on top makes a <i>major chord</i>, and its wheel shows the
        shape:
      </p>

      <ComparisonGrid2>
        <ChordWheel
          rootNote="C"
          chordType={ChordType.Major}
          inversionIndex={0}
          caption="C major"
          isCompact
        />
        <ChordWheel
          rootNote="E"
          chordType={ChordType.Major}
          inversionIndex={0}
          caption="E major"
          isCompact
        />
      </ComparisonGrid2>

      <p>The same triangle, moved to a different starting note - the 4 + 3 stays intact.</p>

      <h2 className={LEARN_STYLES.h2}>Chord progressions</h2>

      <p>
        A chord progression is several chords in a sequence. Each triad chord is a
        triangle on the wheel, so a progression is a triangle that moves, and what makes it
        recognizable is how far it moves each time. Take the 2-5-1 (ii–V–I), a common
        progression in jazz: the chords built on the 2nd, 5th and 1st degrees of the key. Press
        play and watch the sequence develop:
      </p>

      <ProgressionFigure
        tonic="C"
        progression={ChordProgressionType.Two_Five_One}
        caption="The 2-5-1 in C"
        views={["wheel"]}
      />

      <p>
        A minor chord, followed by 2 major chords, each rooted on a different note. Start the same
        pattern on any other note and it&apos;s the same 2-5-1 pattern in a different key.
      </p>

      <h2 className={LEARN_STYLES.h2}>Scales</h2>

      <p>
        A scale is a pattern of 7 notes out of the 12. For example, a major scale and a minor scale are 2 different patterns of 7 notes. 
      </p>

      <ComparisonGrid2>
        <ScaleFigure
          tonic="C"
          scaleType={ScaleModeType.Ionian}
          caption="C major"
          views={["wheel", "linear"]}
          isCompact
        />
        <ScaleFigure
          tonic="C"
          scaleType={ScaleModeType.Aeolian}
          caption="C minor"
          views={["wheel", "linear"]}
          isCompact
        />
      </ComparisonGrid2>

      <p>
        Each scale is a ring around the same tonic, the major scale is <i>brighter</i> while a minor scale is <i>darker</i>. The main difference is the order of the intervals, and that
        shape is what determines the <i>mood</i> of the scale. 
      </p>
    </ArticlePage>
  );
}
