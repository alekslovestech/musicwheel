import type { Metadata } from "next";
import Link from "next/link";

import { ChordColorBreakdown } from "@/components/Learn/figures/ChordColorBreakdown";
import { ChordWheel } from "@/components/Learn/figures/ChordWheel";
import { ComparisonGrid2 } from "@/components/Learn/layout/ComparisonGrid";
import { SeeAlso } from "@/components/Learn/prose/SeeAlso";
import { LEARN_STYLES } from "@/lib/design";
import { learnViewMetadata, metadataForSlugPage } from "@/lib/metadata";
import { ChordType } from "@/types/enums/ChordType";
import { INTERVAL_CLASS_DISSONANCE, ORDER_WEIGHT_MAX } from "@/utils/visual/ColorUtils";

export const metadata: Metadata = metadataForSlugPage(
  learnViewMetadata,
  "/learn/approach/chord-color-formula",
  "How Chord Colors Are Computed",
  "The full recipe behind a chord's color on the wheel: its intervals, their weights, and the mix.",
);

// A variable with an optional subscript, for the formula block.
function V({ name, sub }: { name: string; sub?: string }) {
  return (
    <var>
      {name}
      {sub && <sub>{sub}</sub>}
    </var>
  );
}

export default function ChordColorFormulaPage() {
  return (
    <>
      <Link href="/learn/approach" className={LEARN_STYLES.link}>
        ← Approach
      </Link>

      <h1 className={LEARN_STYLES.h1}>How Chord Colors Are Computed</h1>

      <p>
        <Link href="/learn/approach/color-coding" className={LEARN_STYLES.link}>
          Color Coding
        </Link>{" "}
        gives the short version: a chord&apos;s color is mixed from the intervals it&apos;s made
        of. This page is the full recipe, for anyone who wants to check it. Every number and table
        below comes from the same code that colors the wheel.
      </p>

      <h2 className={LEARN_STYLES.h2}>1. Breaking a chord into gaps</h2>

      <p>
        A chord is a loop of gaps around the circle. Take its notes in order and measure the gap in
        semitones from each one to the next, including the gap that wraps back to the first. C{" "}
        <i>major triad</i> (C, E, G) has gaps of 4, 3 and 5; C <i>minor triad</i> (C, E♭, G) has 3,
        4 and 5.
      </p>

      <p>
        Where you start reading a loop shouldn&apos;t matter, so the list is rotated to a standard
        start: the smallest gap first, and if several gaps tie, the one followed by the smaller gap,
        and so on. That gives 3, 5, 4 for C major and still 3, 4, 5 for C minor. Mathematicians call
        a loop read up to rotation a{" "}
        <Link
          href="https://en.wikipedia.org/wiki/Necklace_(combinatorics)"
          className={LEARN_STYLES.link}
          target="_blank"
          rel="noopener noreferrer"
        >
          necklace
        </Link>
        ; the standard start just picks one name for it.
      </p>

      <p>
        Every root and every inversion of a chord has the same loop of gaps, so they all end up with
        the same list, and the same color (see{" "}
        <Link href="/learn/chords/triad-inversions" className={LEARN_STYLES.link}>
          triad inversions
        </Link>
        ). Major and minor triads use the same 3 gaps but loop in opposite directions, so their
        lists differ.
      </p>

      <p>
        With 4 or more notes, the list also gets diagonals: intervals that span 2 neighboring gaps,
        starting from the smallest gap and sorted from smallest to largest. A chord of n notes gets
        n ÷ 2 of them, rounded down. The rest of this page calls everything in the list an interval.
      </p>

      <h2 className={LEARN_STYLES.h2}>2. Interval colors</h2>

      <p>
        Each interval in the list is replaced by the color of its interval class: the smaller of
        the gap and 12 minus the gap, so a <i>perfect fourth</i> and a <i>perfect fifth</i> share
        class 5. The palette is the one in Color Coding.
      </p>

      <h2 className={LEARN_STYLES.h2}>3. Weights</h2>

      <p>
        The intervals don&apos;t count equally. Each one&apos;s weight is 1, plus its dissonance,
        plus an order bonus.
      </p>

      <p>
        Dissonance is 0 for every class except 2: the <i>minor second</i>/<i>major seventh</i>{" "}
        (class 1) adds {INTERVAL_CLASS_DISSONANCE[1]}, and the <i>tritone</i> (class 6) adds{" "}
        {INTERVAL_CLASS_DISSONANCE[6]}. They&apos;re usually what gives a chord its particular color
        to the ear.
      </p>

      <p>
        The order bonus goes to all the other intervals. It falls in a straight line from{" "}
        {ORDER_WEIGHT_MAX} for the first interval in the list to 0 for the last. This is what tells
        a major triad from a minor one: both start with a <i>minor third</i>, then hold a{" "}
        <i>major third</i> and a <i>perfect fourth</i> in opposite order, so the bonus lands
        differently.
      </p>

      <div className="flex flex-col gap-snug overflow-x-auto rounded-lg border border-containers-divider bg-canvas-bgScales p-normal">
        <div>
          <V name="w" sub="i" /> = 1 + dissonance(<V name="class" sub="i" />) + <V name="order" sub="i" />
        </div>
        <div>
          <V name="order" sub="i" /> = {ORDER_WEIGHT_MAX} · (<V name="n" /> − 1 − <V name="i" />) / (
          <V name="n" /> − 1) for a consonant interval, 0 for an unstable one
        </div>
      </div>

      <p>
        Here <var>n</var> is the number of intervals in the list and <var>i</var> is an
        interval&apos;s position in it, starting at 0.
      </p>

      <ComparisonGrid2>
        <ChordWheel
          rootNote="C"
          chordType={ChordType.Major}
          inversionIndex={0}
          caption="C major"
          showKeyboard={false}
        />
        <ChordWheel
          rootNote="C"
          chordType={ChordType.Minor}
          inversionIndex={0}
          caption="C minor"
          showKeyboard={false}
        />
      </ComparisonGrid2>

      <ChordColorBreakdown rootNote="C" chordType={ChordType.Major} caption="C major" />
      <ChordColorBreakdown rootNote="C" chordType={ChordType.Minor} caption="C minor" />

      <h2 className={LEARN_STYLES.h2}>4. The mix</h2>

      <p>
        The interval colors are then averaged using those weights, so a heavier interval pulls the
        result closer to its color. A single note has no gaps and gets the color of class 0. A
        2-note interval has 2 gaps in the same class, so it mixes to that class&apos;s own color.
      </p>

      <h2 className={LEARN_STYLES.h2}>Where it gets blurry</h2>

      <p>
        Every extra note adds intervals to the average, diagonals included, and averaging pulls
        colors toward the middle. A <i>major 7th</i> chord has 6 intervals in its list:
      </p>

      <ChordColorBreakdown rootNote="C" chordType={ChordType.Major7} caption="C major 7th" />

      <p>
        Chords with 4 or more notes therefore sit closer together in color than triads do. Read the
        color as a cue to a chord&apos;s character, and the name as the way to tell chords apart.
      </p>

      <SeeAlso items={["chord-quality", "symmetry-and-dissonance"]} />
    </>
  );
}
