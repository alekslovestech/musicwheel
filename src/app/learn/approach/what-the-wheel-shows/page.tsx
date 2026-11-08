import type { Metadata } from "next";
import Link from "next/link";

import { ArticleNav } from "@/components/Learn/prose/ArticleNav";
import { ComparisonGrid2, ComparisonGrid3 } from "@/components/Learn/layout/ComparisonGrid";
import { ChordWheel } from "@/components/Learn/figures/ChordWheel";
import { ScaleFigure } from "@/components/Learn/figures/ScaleFigure";
import { SeeAlso } from "@/components/Learn/prose/SeeAlso";
import { LEARN_STYLES } from "@/lib/design";
import { learnViewMetadata, metadataForSlugPage } from "@/lib/metadata";
import { ChordType } from "@/types/enums/ChordType";
import { IntervalType } from "@/types/enums/IntervalType";
import { ScaleModeType } from "@/types/enums/ScaleModeType";

export const metadata: Metadata = metadataForSlugPage(
  learnViewMetadata,
  "/learn/approach/what-the-wheel-shows",
  "What the Wheel Shows",
  "Intervals, chords, progressions and scales drawn as shapes on the chromatic circle, where each looks the same wherever it starts.",
);

export default function WhatTheWheelShowsPage() {
  return (
    <>
      <Link href="/learn/approach" className={LEARN_STYLES.link}>
        ← Approach
      </Link>

      <ArticleNav id="what-the-wheel-shows" compact />

      <h1 className={LEARN_STYLES.h1}>What the Wheel Shows</h1>

      <p>
        Intervals, chords, progressions and scales each have a shape that stays the same wherever
        it starts. On the wheel, the keyboard&apos;s line of 12 notes bent into a loop (the{" "}
        <Link href="/learn/approach/chromatic-circle" className={LEARN_STYLES.link}>
          chromatic circle
        </Link>
        ), that shape is what you see.
      </p>

      <h2 className={LEARN_STYLES.h2}>Intervals</h2>

      <p>
        A <i>major third</i> starting on C and one starting on E&nbsp;-&nbsp;the same angle, just
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

      <p>No staff lines to compare, no sharp to explain away - the 2 wedges are the same shape.</p>

      <h2 className={LEARN_STYLES.h2}>Chords</h2>

      <p>A chord is a shape, so a chord&apos;s own wheel is that shape:</p>

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

      <p>The same triangle, moved to a different starting wedge - nothing else changes.</p>

      <h2 className={LEARN_STYLES.h2}>Chord progressions</h2>

      <p>ii–V–I in C, and the same ii–V–I in D:</p>

      <ComparisonGrid3>
        <ChordWheel
          rootNote="D"
          chordType={ChordType.Minor}
          inversionIndex={0}
          caption="ii: D minor"
          isCompact
        />
        <ChordWheel
          rootNote="G"
          chordType={ChordType.Major}
          inversionIndex={0}
          caption="V: G major"
          isCompact
        />
        <ChordWheel
          rootNote="C"
          chordType={ChordType.Major}
          inversionIndex={0}
          caption="I: C major"
          isCompact
        />
      </ComparisonGrid3>

      <ComparisonGrid3>
        <ChordWheel
          rootNote="E"
          chordType={ChordType.Minor}
          inversionIndex={0}
          caption="ii: E minor"
          isCompact
        />
        <ChordWheel
          rootNote="A"
          chordType={ChordType.Major}
          inversionIndex={0}
          caption="V: A major"
          isCompact
        />
        <ChordWheel
          rootNote="D"
          chordType={ChordType.Major}
          inversionIndex={0}
          caption="I: D major"
          isCompact
        />
      </ComparisonGrid3>

      <p>
        3 triangles, 3 rotations, same relative spacing every time - that&apos;s the ii–V–I that
        holds in any key.
      </p>

      <h2 className={LEARN_STYLES.h2}>Scales</h2>

      <p>C Dorian and C Lydian, same tonic, different pattern of wedges:</p>

      <ComparisonGrid2>
        <ScaleFigure
          tonic="C"
          scaleType={ScaleModeType.Dorian}
          caption="C Dorian"
          views={["wheel", "linear"]}
          isCompact
          showAppLink={false}
        />
        <ScaleFigure
          tonic="C"
          scaleType={ScaleModeType.Lydian}
          caption="C Lydian"
          views={["wheel", "linear"]}
          isCompact
          showAppLink={false}
        />
      </ComparisonGrid2>

      <p>
        The darker and brighter moods aren&apos;t a few accidentals apart - they&apos;re 2
        differently-shaped rings around the same point.
      </p>

      <h2 className={LEARN_STYLES.h2}>The common thread, visible</h2>

      <p>
        Nothing in the 4 ideas above changed. What changed is that the shape each one depends on
        is now the thing you&apos;re looking at, not something you have to reconstruct from
        letters and accidentals.
      </p>

      <SeeAlso items={["color-coding", "symmetry-and-dissonance", "accidentals"]} />

      <ArticleNav id="what-the-wheel-shows" />
    </>
  );
}
