import type { Metadata } from "next";
import Link from "next/link";

import { ComparisonGrid2 } from "@/components/Learn/ComparisonGrid";
import { StaticChordFigure } from "@/components/Learn/StaticChordFigure";
import { LEARN_STYLES } from "@/lib/design";
import { INTERVAL_CLASS_PALETTE } from "@/lib/design/palette";
import { learnViewMetadata, metadataForSlugPage } from "@/lib/metadata";
import { IntervalType } from "@/types/enums/IntervalType";

export const metadata: Metadata = metadataForSlugPage(
  learnViewMetadata,
  "/learn/interval-inversions",
  "Interval Inversions",
  "Every interval has a complementary partner that adds up with it to an octave - a different number, but usually a strikingly similar character.",
);

const INVERSION_PAIRS: {
  ic: keyof typeof INTERVAL_CLASS_PALETTE;
  pair: string;
  character: string;
}[] = [
  {
    ic: 1,
    pair: "Minor 2nd / Major 7th",
    character: "The tightest possible clash - both sharp, both biting.",
  },
  {
    ic: 2,
    pair: "Major 2nd / Minor 7th",
    character: "Open and a little restless, but nowhere near as harsh.",
  },
  { ic: 3, pair: "Minor 3rd / Major 6th", character: "Mellow and a bit wistful." },
  {
    ic: 4,
    pair: "Major 3rd / Minor 6th",
    character: "The two sweetest, most settled intervals in the system.",
  },
  {
    ic: 5,
    pair: "Perfect 4th / Perfect 5th",
    character: "Clean, open, almost hollow - the least ambiguous sound there is.",
  },
  {
    ic: 6,
    pair: "Tritone (with itself)",
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
        />
        <StaticChordFigure
          rootNote="C"
          chordType={IntervalType.Major7}
          inversionIndex={0}
          caption="C to B: a major 7th, eleven semitones up - the complementary distance from the same C."
        />
      </ComparisonGrid2>

      <p>
        The same thing happens with a perfect 4th and a perfect 5th. Five semitones up from C lands
        on F; seven semitones up from that same C - the complementary distance - lands on G, the
        single most consonant interval next to the octave.
      </p>

      <ComparisonGrid2>
        <StaticChordFigure
          rootNote="C"
          chordType={IntervalType.Fourth}
          inversionIndex={0}
          caption="C to F: a perfect 4th, five semitones up."
        />
        <StaticChordFigure
          rootNote="C"
          chordType={IntervalType.Fifth}
          inversionIndex={0}
          caption="C to G: a perfect 5th, seven semitones up - the complementary distance from the same C."
        />
      </ComparisonGrid2>

      <h2 className="text-xl font-semibold">Why inverted intervals sound like relatives</h2>

      <p>
        This isn&apos;t a coincidence, and it isn&apos;t really about the two notes at all -
        it&apos;s about the wheel. An interval and its inversion always add up to a full octave,
        twelve semitones: 1 and 11, 2 and 10, 5 and 7. The wheel doesn&apos;t care which direction
        you travel around it, only how far - so the short way around is exactly the same distance
        for both members of the pair. That&apos;s the same interval class from{" "}
        <Link href="/learn/color-coding" className={LEARN_STYLES.link}>
          Color Coding
        </Link>{" "}
        showing up again: a minor 2nd and a major 7th get the same color on the wheel because
        they&apos;re the same distance, just going the short way around versus the long way around.
      </p>

      <div className="flex flex-col gap-tight rounded-lg border border-containers-divider bg-canvas-bgScales p-normal">
        {INVERSION_PAIRS.map((row) => (
          <div key={row.ic} className="flex items-start gap-snug">
            <div
              className="mt-1 h-5 w-5 shrink-0 rounded-sm border border-containers-divider/40"
              style={{ backgroundColor: INTERVAL_CLASS_PALETTE[row.ic] }}
            />
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="text-sm font-medium">{row.pair}</span>
              <span className="text-xs text-labels-textDefault opacity-70">{row.character}</span>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold">The tritone: its own inverse</h2>

      <p>
        Six of the seven interval classes pair up with a partner. The tritone doesn&apos;t, because
        six semitones is exactly half of twelve: subtract six from twelve and you get six right
        back. Six semitones up from C lands on F# - and there&apos;s no complementary distance to go
        find, because the complement of six is six. There&apos;s no second name for it to become,
        and no direction that makes it resolve toward something smaller. That symmetry is exactly
        why it sounds suspended rather than clearly settled or clearly clashing - it&apos;s the one
        interval the wheel can&apos;t point anywhere else.
      </p>

      <ComparisonGrid2>
        <StaticChordFigure
          rootNote="C"
          chordType={IntervalType.Tritone}
          inversionIndex={0}
          caption="C to F#: a tritone, six semitones."
        />
        <StaticChordFigure
          rootNote="C"
          chordType={IntervalType.Tritone}
          inversionIndex={0}
          caption="C to F#, again: the complementary distance is six semitones too, so there's nowhere else to land."
        />
      </ComparisonGrid2>
    </>
  );
}
