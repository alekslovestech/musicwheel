import type { Metadata } from "next";
import Link from "next/link";

import {
  ComparisonGrid2,
  ComparisonGrid3,
  ComparisonGrid4,
} from "@/components/Learn/ComparisonGrid";
import { StaticChordFigure } from "@/components/Learn/StaticChordFigure";
import { ScaleFigure } from "@/components/Learn/ScaleFigure";
import { LEARN_STYLES } from "@/lib/design";
import { learnViewMetadata, metadataForSlugPage } from "@/lib/metadata";
import { ChordType } from "@/types/enums/ChordType";
import { IntervalType } from "@/types/enums/IntervalType";
import { OtherScaleType } from "@/types/enums/OtherScaleType";

export const metadata: Metadata = metadataForSlugPage(
  learnViewMetadata,
  "/learn/symmetry-and-dissonance",
  "Symmetry and Dissonance",
  "Why the wheel's most symmetrical shapes - the tritone, the augmented triad, the diminished 7th - are also its most unsettled: split the octave evenly and no note is left to call home.",
);

export default function SymmetryAndDissonancePage() {
  return (
    <>
      <Link href="/learn" className={LEARN_STYLES.link}>
        ← Learn
      </Link>

      <h1 className={LEARN_STYLES.h1}>Symmetry and Dissonance</h1>

      <p>
        What happens when the distance between notes in an interval, chord, or scale is the same size? Slice the
        octave into equal parts and the resulting shape looks identical no matter which note you
        start counting from - so it has no single note to point back to. Every candidate for
        &ldquo;root&rdquo; is equally good and equally arbitrary, and an ear that can&apos;t settle
        on a home note hears that as tension rather than repose. Change the root and the shape
        doesn&apos;t change flavor at all - it&apos;s the same sound, just relabeled.
      </p>

      <h2 className={LEARN_STYLES.h2}>The tritone: splitting the octave in two</h2>

      <p>
        Twelve semitones split into two equal halves is six and six. C up to F# is a tritone;
        continue the same six semitones past F# and you land back on C. As{" "}
        <Link href="/learn/interval-inversions" className={LEARN_STYLES.link}>
          Interval Inversions
        </Link>{" "}
        covers, it&apos;s the one interval that inverts to itself - there&apos;s no second, smaller
        name for it to resolve into, no direction that feels more like &ldquo;home&rdquo; than the
        other. That&apos;s the two-part version of the same story this page keeps retelling: the
        symmetry isn&apos;t incidental to the tension, it&apos;s the cause of it.
      </p>

      <ComparisonGrid2>
        <StaticChordFigure
          rootNote="C"
          chordType={IntervalType.Tritone}
          inversionIndex={0}
          caption="C to F#: 6 semitones apart"
        />
        <StaticChordFigure
          rootNote="C"
          chordType={IntervalType.Tritone}
          inversionIndex={1}
          caption="F# to C: still 6 semitones apart"
        />
      </ComparisonGrid2>

      <h2 className={LEARN_STYLES.h2}>The augmented triad: splitting the octave in three</h2>

      <p>
        Twelve semitones split into three equal parts is four apiece - three stacked major thirds.
        Unlike the major triad, rotating this shape doesn&apos;t change the gap pattern at all:
        every gap is the same four semitones, so C augmented, E augmented, and G# augmented
        aren&apos;t three different chords that happen to share a color - they&apos;re the same
        three wedges on the wheel, lit for the same reason, no matter which note you call the root.
      </p>

      <ComparisonGrid3>
        <StaticChordFigure
          rootNote="C"
          chordType={ChordType.Augmented}
          inversionIndex={0}
          caption="Caug"
        />
        <StaticChordFigure
          rootNote="E"
          chordType={ChordType.Augmented}
          inversionIndex={0}
          caption="Caug/E (or E aug) "
        />
        <StaticChordFigure
          rootNote="G#"
          chordType={ChordType.Augmented}
          inversionIndex={0}
          caption="Caug/G# (or Gaug)"
        />
      </ComparisonGrid3>

      <p>
        That&apos;s three equally valid roots for one shape, which in practice means none of them is
        privileged - the chord doesn&apos;t resolve toward C any more than it resolves toward E or
        G#. Composers use exactly that: an augmented triad is a natural pivot, since it&apos;s
        already sitting equidistant from three different keys at once.
      </p>

      <h2 className={LEARN_STYLES.h2}>The diminished 7th: splitting the octave in four</h2>

      <p>
        Twelve semitones split into four equal parts is three apiece - four stacked minor thirds.
        The same logic applies with one more note added: C, D#, F#, and A are all three semitones
        from their neighbor, so the shape has four-fold symmetry instead of the augmented
        triad&apos;s three-fold. Root any of those four notes and you light the identical four
        wedges.
      </p>

      <ComparisonGrid4>
        <StaticChordFigure
          rootNote="C"
          chordType={ChordType.Diminished7}
          inversionIndex={0}
          caption="Cdim7"
        />
        <StaticChordFigure
          rootNote="D#"
          chordType={ChordType.Diminished7}
          inversionIndex={0}
          caption="Cdim7/D# (or D#dim7)"
        />
        <StaticChordFigure
          rootNote="F#"
          chordType={ChordType.Diminished7}
          inversionIndex={0}
          caption="Cdim7/F# (or F#dim7)"
        />
        <StaticChordFigure
          rootNote="A"
          chordType={ChordType.Diminished7}
          inversionIndex={0}
          caption="Cdim7/A (or Adim7)"
        />
      </ComparisonGrid4>

      <p>
        A diminished 7th chord is the sharpest-sounding shape on the wheel partly for this reason -
        it&apos;s the most symmetrical thing you can build out of four notes, so it has the least
        claim on any single resolution. That&apos;s exactly why it&apos;s so useful: the same four
        notes, spelled and resolved four different ways, can lead into four unrelated keys.
        Ambiguity about where a chord is &ldquo;from&rdquo; turns into flexibility about where it
        can go.
      </p>

      <h2 className={LEARN_STYLES.h2}>The whole-tone scale: splitting the octave in six</h2>

      <p>
        The same idea scales up past four notes. Slice the octave into six equal parts instead of
        four - whole steps instead of minor thirds - and you get the whole-tone scale: six notes,
        every gap the same two semitones. With every gap identical, the scale has no note that
        stands out as more &ldquo;home&rdquo; than any other. It doesn&apos;t matter where you
        start counting from - the same six notes, walked in from any point, are the same scale. That
        rootlessness is a large part of why it sounds the way it does: disorienting and dreamy,
        drifting rather than resolving, because there&apos;s nowhere in the shape itself that&apos;s
        distinguished from anywhere else.
      </p>

      <ComparisonGrid2>
        <ScaleFigure
          tonic="C"
          scaleType={OtherScaleType.WholeTone}
          caption="Root C: C, D, E, F#, G#, A#."
          showStepAnnotations
          showLinearKeyboard
        />
        <ScaleFigure
          tonic="D"
          scaleType={OtherScaleType.WholeTone}
          caption="Call D the root instead - the same six wedges, D, E, F#, G#, A#, C."
          showStepAnnotations
          showLinearKeyboard
        />
      </ComparisonGrid2>

      <h2 className={LEARN_STYLES.h2}>The pattern</h2>

      <p>
        In all four cases the mechanism is identical: an evenly spaced shape maps onto itself when
        you rotate it, so the wheel can&apos;t point back to any one wedge as more
        &ldquo;root&rdquo; than the others. What the ear experiences as unresolved tension is that
        structural fact, heard rather than reasoned about - a shape with no distinguishing feature
        to settle on. The more symmetrical the shape, the less it has to say about where it belongs,
        and the more it seems to demand somewhere to go.
      </p>
    </>
  );
}
