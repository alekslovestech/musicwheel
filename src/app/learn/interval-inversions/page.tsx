import type { Metadata } from "next";
import { Fragment } from "react";
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
  semitonesA: string;
  semitonesB: string;
  nameA: string;
  nameB: string;
  character: string;
}[] = [
  {
    intervalA: IntervalType.Minor2,
    intervalB: IntervalType.Major7,
    noteA: "Db",
    noteB: "B",
    semitonesA: "one semitone",
    semitonesB: "eleven semitones",
    nameA: "a minor 2nd",
    nameB: "a major 7th",
    character: "The tightest possible clash - both sharp, both biting.",
  },
  {
    intervalA: IntervalType.Major2,
    intervalB: IntervalType.Minor7,
    noteA: "D",
    noteB: "Bb",
    semitonesA: "two semitones",
    semitonesB: "ten semitones",
    nameA: "a major 2nd",
    nameB: "a minor 7th",
    character: "Open and a little restless, but nowhere near as harsh.",
  },
  {
    intervalA: IntervalType.Minor3,
    intervalB: IntervalType.Major6,
    noteA: "Eb",
    noteB: "A",
    semitonesA: "three semitones",
    semitonesB: "nine semitones",
    nameA: "a minor 3rd",
    nameB: "a major 6th",
    character: "Mellow and a bit wistful.",
  },
  {
    intervalA: IntervalType.Major3,
    intervalB: IntervalType.Minor6,
    noteA: "E",
    noteB: "Ab",
    semitonesA: "four semitones",
    semitonesB: "eight semitones",
    nameA: "a major 3rd",
    nameB: "a minor 6th",
    character: "The two sweetest, most settled intervals in the system.",
  },
  {
    intervalA: IntervalType.Fourth,
    intervalB: IntervalType.Fifth,
    noteA: "F",
    noteB: "G",
    semitonesA: "five semitones",
    semitonesB: "seven semitones",
    nameA: "a perfect 4th",
    nameB: "a perfect 5th",
    character: "Clean, open, almost hollow - the least ambiguous sound there is.",
  },
  {
    intervalA: IntervalType.Tritone,
    intervalB: IntervalType.Tritone,
    noteA: "F#",
    noteB: "F#",
    semitonesA: "six semitones",
    semitonesB: "six semitones",
    nameA: "a tritone",
    nameB: "a tritone",
    character: "Splits the octave exactly in half, so it has no partner - it inverts to itself.",
  },
];

export default function IntervalInversionsPage() {
  return (
    <>
      <Link href="/learn" className={LEARN_STYLES.link}>
        ← Learn
      </Link>

      <h1 className="text-3xl font-semibold">Interval Inversions</h1>

      <p>
        <Link href="/learn/triad-inversions" className={LEARN_STYLES.link}>
          Triad inversions
        </Link>{" "}
        showed three notes that stay the same chord no matter which one is on the bottom. A bare
        interval - just two notes - has an inversion too, but it&apos;s really about distance rather
        than about the notes themselves: any interval&apos;s inversion is just whatever&apos;s left
        over after subtracting it from a full octave. Count a small distance up from a note and you
        get one interval; count the complementary large distance up from that same note and you get
        another - a different name entirely, and yet the two you land on still sound like close
        relatives of each other.
      </p>

      <h2 className="text-xl font-semibold">Same starting note, two complementary distances</h2>

      <p>
        Start from C and go up a semitone, and you land on Db - a minor 2nd. Start from that same C
        and go up eleven semitones instead, and you land on B - a major 7th. Same starting note both
        times; the two distances always add up to twelve semitones between them.
      </p>

      <ComparisonGrid2>
        <StaticChordFigure
          rootNote="C"
          chordType={IntervalType.Minor2}
          inversionIndex={0}
          caption="C to Db: a minor 2nd, one semitone up."
          isCompact
        />
        <StaticChordFigure
          rootNote="C"
          chordType={IntervalType.Major7}
          inversionIndex={0}
          caption="C to B: a major 7th, eleven semitones up - the complementary distance from the same C."
          isCompact
        />
      </ComparisonGrid2>

      <h2 className="text-xl font-semibold">Why inverted intervals sound like relatives</h2>

      <p>
        This isn&apos;t a coincidence, and it isn&apos;t really about the two notes at all -
        it&apos;s about the wheel. An interval and its inversion always add up to a full octave,
        twelve semitones: 1 and 11, 2 and 10, 5 and 7. The wheel doesn&apos;t care which direction
        you travel around it, only how far - so the short way around is exactly the same distance
        for both members of the pair. That&apos;s the same interval class from{" "}
        <Link href="/learn/approach/color-coding" className={LEARN_STYLES.link}>
          Color Coding
        </Link>{" "}
        showing up again: a minor 2nd and a major 7th get the same color on the wheel because
        they&apos;re the same distance, just going the short way around versus the long way around.
      </p>

      <h2 className="text-xl font-semibold">The rest of the interval classes</h2>

      <p>
        The same pattern holds all the way through. Six of the seven interval classes pair up this
        way; the tritone doesn&apos;t - six semitones is exactly half of twelve, so subtracting it
        from twelve just gives you six back. It&apos;s its own inversion, with nowhere else to land.
      </p>

      {INVERSION_PAIRS.slice(1).map(
        ({ intervalA, intervalB, noteA, noteB, semitonesA, semitonesB, nameA, nameB, character }) => (
          <Fragment key={`${intervalA}-${intervalB}`}>
            <p>{character}</p>
            <ComparisonGrid2>
              <StaticChordFigure
                rootNote="C"
                chordType={intervalA}
                inversionIndex={0}
                caption={`C to ${noteA}: ${nameA}, ${semitonesA} up.`}
                isCompact
              />
              <StaticChordFigure
                rootNote="C"
                chordType={intervalB}
                inversionIndex={0}
                caption={
                  intervalA === intervalB
                    ? `C to ${noteB}, again: the complementary distance is ${semitonesB} too, so there's nowhere else to land.`
                    : `C to ${noteB}: ${nameB}, ${semitonesB} up - the complementary distance from the same C.`
                }
                isCompact
              />
            </ComparisonGrid2>
          </Fragment>
        ),
      )}
    </>
  );
}
