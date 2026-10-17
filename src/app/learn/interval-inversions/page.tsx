import type { Metadata } from "next";
import Link from "next/link";

import { ComparisonGrid2 } from "@/components/Learn/ComparisonGrid";
import { StaticChordFigure } from "@/components/Learn/StaticChordFigure";
import { LEARN_STYLES } from "@/lib/design";
import { learnViewMetadata, metadataForSlugPage } from "@/lib/metadata";
import { INTERVAL_PAIRS, type IntervalPair } from "@/lib/learn/intervalPairs";

export const metadata: Metadata = metadataForSlugPage(
  learnViewMetadata,
  "/learn/interval-inversions",
  "Interval Inversions",
  "Every interval has a complementary partner that adds up with it to an octave - a different number, but usually a strikingly similar character.",
);

/** What this page says about each pair, which is written for "every interval starts from C". */
const PAIR_DETAILS: Record<
  IntervalPair["intervalClass"],
  { noteA: string; noteB: string; character: string }
> = {
  1: { noteA: "D♭", noteB: "B", character: "the tightest possible clash - both sharp and biting." },
  2: { noteA: "D", noteB: "B♭", character: "open and a little restless" },
  3: { noteA: "E♭", noteB: "A", character: "mellow and a bit wistful." },
  4: {
    noteA: "E",
    noteB: "A♭",
    character: "the two sweetest, most settled intervals in the system.",
  },
  5: { noteA: "F", noteB: "G", character: "clean, open, and stable." },
  6: {
    noteA: "F♯",
    noteB: "F♯",
    character: "splits the octave exactly in half, so it inverts to itself.",
  },
};

export default function IntervalInversionsPage() {
  return (
    <>
      <Link href="/learn" className={LEARN_STYLES.link}>
        ← Learn
      </Link>

      <h1 className={LEARN_STYLES.h1}>Interval Inversions</h1>

      <p>
        <Link href="/learn/chords/triad-inversions" className={LEARN_STYLES.link}>
          Triad inversions
        </Link>{" "}
        showed three notes that stay the same chord no matter which one is on the bottom. A bare
        interval - just two notes - has an inversion too, and it&apos;s really about distance:
        whatever&apos;s left over after subtracting the interval from a full octave.
      </p>

      <h2 className={LEARN_STYLES.h2}>Why inverted intervals sound like relatives</h2>

      <p>
        An interval and its inversion always add up to a full octave, 12 semitones: 1 + 11, 2 + 10,
        5 + 7. The names are entirely different, yet the 2 sound like close relatives. The wheel
        doesn&apos;t care which direction you travel around it, only how far - so the short way
        around is exactly the same distance for both members of the pair. That&apos;s the same
        interval class from{" "}
        <Link href="/learn/approach/color-coding" className={LEARN_STYLES.link}>
          Color Coding
        </Link>{" "}
        showing up again: a <i>minor 2nd</i> and a <i>major 7th</i>&nbsp;get the same color on the
        wheel because they&apos;re the same distance, just going the short way around versus the
        long way around.
      </p>

      <h2 className={LEARN_STYLES.h2}>The interval classes</h2>

      <p>
        Each pair below starts from the same C. Six of the seven interval classes pair up this way;
        the <i>tritone</i>&nbsp;is a special case where it is its own inversion, and 6 + 6 = 12.
      </p>

      {INTERVAL_PAIRS.map(({ intervalClass, intervalA, intervalB, nameA, nameB }) => {
        const { noteA, noteB, character } = PAIR_DETAILS[intervalClass];
        return (
          <ComparisonGrid2
            key={`${intervalA}-${intervalB}`}
            caption={
              intervalA === intervalB ? (
                <>
                  <i>{nameA}</i>: {character}
                </>
              ) : (
                <>
                  <i>{nameA}</i> and <i>{nameB}</i>: {character}
                </>
              )
            }
          >
            <StaticChordFigure
              rootNote="C"
              chordType={intervalA}
              inversionIndex={0}
              caption={
                <>
                  C–{noteA}: <i>{nameA}</i>
                </>
              }
              isCompact
            />
            <StaticChordFigure
              rootNote="C"
              chordType={intervalB}
              inversionIndex={0}
              caption={
                intervalA === intervalB ? (
                  <>C–{noteB}, again</>
                ) : (
                  <>
                    C–{noteB}: <i>{nameB}</i>
                  </>
                )
              }
              isCompact
            />
          </ComparisonGrid2>
        );
      })}
    </>
  );
}
