import type { Metadata } from "next";
import Link from "next/link";

import { ComparisonGrid2 } from "@/components/Learn/ComparisonGrid";
import { StaticChordFigure } from "@/components/Learn/StaticChordFigure";
import { LEARN_STYLES } from "@/lib/design";
import { learnViewMetadata, metadataForSlugPage } from "@/lib/metadata";
import { IntervalType } from "@/types/enums/IntervalType";

export const metadata: Metadata = metadataForSlugPage(
  learnViewMetadata,
  "/learn/interval-inversions",
  "Interval Inversions",
  "Every interval has a complementary partner that adds up with it to an octave - a different number, but usually a strikingly similar character.",
);

const INVERSION_PAIRS: {
  intervalA: IntervalType;
  intervalB: IntervalType;
  noteA: string;
  noteB: string;
  nameA: string;
  nameB: string;
  character: string;
}[] = [
  {
    intervalA: IntervalType.Minor2,
    intervalB: IntervalType.Major7,
    noteA: "D♭",
    noteB: "B",
    nameA: "minor 2nd",
    nameB: "major 7th",
    character: "the tightest possible clash - both sharp and biting.",
  },
  {
    intervalA: IntervalType.Major2,
    intervalB: IntervalType.Minor7,
    noteA: "D",
    noteB: "B♭",
    nameA: "major 2nd",
    nameB: "minor 7th",
    character: "open and a little restless",
  },
  {
    intervalA: IntervalType.Minor3,
    intervalB: IntervalType.Major6,
    noteA: "E♭",
    noteB: "A",
    nameA: "minor 3rd",
    nameB: "major 6th",
    character: "mellow and a bit wistful.",
  },
  {
    intervalA: IntervalType.Major3,
    intervalB: IntervalType.Minor6,
    noteA: "E",
    noteB: "A♭",
    nameA: "major 3rd",
    nameB: "minor 6th",
    character: "the two sweetest, most settled intervals in the system.",
  },
  {
    intervalA: IntervalType.Fourth,
    intervalB: IntervalType.Fifth,
    noteA: "F",
    noteB: "G",
    nameA: "perfect 4th",
    nameB: "perfect 5th",
    character: "clean, open, and stable.",
  },
  {
    intervalA: IntervalType.Tritone,
    intervalB: IntervalType.Tritone,
    noteA: "F♯",
    noteB: "F♯",
    nameA: "tritone",
    nameB: "tritone",
    character: "splits the octave exactly in half, so it inverts to itself.",
  },
];

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

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

      {INVERSION_PAIRS.map(
        ({ intervalA, intervalB, noteA, noteB, nameA, nameB, character }) => (
          <ComparisonGrid2
            key={`${intervalA}-${intervalB}`}
            caption={
              intervalA === intervalB ? (
                <>
                  <i>{capitalize(nameA)}</i>: {character}
                </>
              ) : (
                <>
                  <i>{capitalize(nameA)}</i> and <i>{nameB}</i>: {character}
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
                  C to {noteA}: <i>{nameA}</i>
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
                  <>C to {noteB}, again</>
                ) : (
                  <>
                    C to {noteB}: <i>{nameB}</i>
                  </>
                )
              }
              isCompact
            />
          </ComparisonGrid2>
        ),
      )}
    </>
  );
}
