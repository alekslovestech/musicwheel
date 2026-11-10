import type { Metadata } from "next";
import Link from "next/link";

import { ChordColorBreakdown } from "@/components/Learn/figures/ChordColorBreakdown";
import { ChordWheel } from "@/components/Learn/figures/ChordWheel";
import { IntervalColorTable } from "@/components/Learn/figures/IntervalColorTable";
import { ComparisonGrid2 } from "@/components/Learn/layout/ComparisonGrid";
import { Equations, Formula, Frac, Sum, V } from "@/components/Learn/prose/Formula";
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

// [d_i = 0]: 1 when the interval has no dissonance, 0 when it does.
function IversonDissonance() {
  return (
    <>
      <mo>[</mo>
      <V n="d" sub="i" />
      <mo>=</mo>
      <mn>0</mn>
      <mo>]</mo>
    </>
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
        gives the short version; this page is the full recipe, computed by the same code that
        colors the wheel. A chord&apos;s color should do 4 things:
      </p>

      <ol className="list-decimal pl-normal">
        <li>Transposing to another key keeps the color.</li>
        <li>Inverting an interval or a chord keeps its color.</li>
        <li>Chords of different qualities get different colors.</li>        
        <li>Order matters, so a major and a minor triad differ.</li>
        <li>
          Dissonance adds extra flavor: the <i>tritone</i>, <i>major seventh</i> and{" "}
          <i>minor second</i> count for more than the common intervals.
        </li>
      </ol>

      <p>
        The recipe starts from single intervals and builds chords up from them, one goal at a time.
      </p>

      <h2 className={LEARN_STYLES.h2}>1. Intervals have colors</h2>

      <p>
        Each interval takes the color of its interval class: the smaller of its size in semitones
        and 12 minus that size. An interval is a distance, not a pitch, so it looks the same in any
        key (the 2nd goal). And a <i>perfect fourth</i> and its inversion, a <i>perfect fifth</i>,
        share class 5, and so share a color (the 3rd).
      </p>

      <IntervalColorTable />

      <p>A chord is several intervals at once. Which ones, and does their order matter?</p>

      <h2 className={LEARN_STYLES.h2}>2. A chord is a necklace of intervals</h2>

      <p>
        Walk from each note of a chord to the next, wrapping from the last back to the first. The
        intervals you walk form a loop, which mathematicians call a{" "}
        <Link
          href="https://en.wikipedia.org/wiki/Necklace_(combinatorics)"
          className={LEARN_STYLES.link}
          target="_blank"
          rel="noopener noreferrer"
        >
          <i>necklace</i>
        </Link>
        . It is made of distances, so a chord has the same <i>necklace</i> in every key. And where
        you start reading doesn&apos;t change it, so every inversion is the same <i>necklace</i>{" "}
        too (see{" "}
        <Link href="/learn/chords/triad-inversions" className={LEARN_STYLES.link}>
          triad inversions
        </Link>
        ). That covers the 2nd and 3rd goals for chords.
      </p>

      <p>
        The order around the loop does matter, though. C major (C, E, G) is a <i>necklace</i> of a{" "}
        <i>major third</i>, a <i>minor third</i> and a <i>perfect fourth</i>. C minor (C, E♭, G)
        is a <i>necklace</i> of the same 3 intervals in another order, and the 4th goal says they
        should look different:
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

      <h2 className={LEARN_STYLES.h2}>3. Weighting the intervals</h2>

      <p>
        Each interval starts at a weight of 1. To make order matter, the weights depend on an
        interval&apos;s place in the <i>necklace</i>, so we need a first one: the smallest
        interval, or if several tie, the one followed by the smaller interval. In semitones, a
        major triad then reads 3, 5, 4 and a minor triad 3, 4, 5.
      </p>

      <p>
        Order: each interval gains an order weight (<Formula math={<V n="o" />} />), {ORDER_WEIGHT_MAX}{" "}
        for the first, falling in a straight line to 0 for the last. Both triads start with the{" "}
        <i>minor third</i>, but a minor triad puts the <i>major third</i> 2nd, and a major triad
        puts it last, behind the <i>perfect fourth</i>, so the <i>major third</i> gets a different
        weight in each.
      </p>

      <p>
        Dissonance: the <i>minor second</i>, <i>major seventh</i> (class 1) and <i>tritone</i>{" "}
        (class 6) gain a dissonance weight (<Formula math={<V n="d" />} />) of{" "}
        {INTERVAL_CLASS_DISSONANCE[1]} and {INTERVAL_CLASS_DISSONANCE[6]} instead, wherever they
        sit, so they flavor the color more than the common intervals do.
      </p>

      <h2 className={LEARN_STYLES.h2}>4. The mix</h2>

      <p>
        The chord&apos;s color is the weighted average of its interval colors, taken in LCH, a
        color space that blends hues smoothly, with hue averaged as an angle. Worked through for
        both triads:
      </p>

      <ChordColorBreakdown rootNote="C" chordType={ChordType.Major} caption="C major" />
      <ChordColorBreakdown rootNote="C" chordType={ChordType.Minor} caption="C minor" />

      <p>
        Same intervals, same 3 weights, paired differently: the minor triad gives the{" "}
        <i>major third</i> more weight, so its mix leans further toward that green. That is the
        whole difference between the 2 colors.
      </p>

      <p>All together, the recipe is:</p>

      <Formula
        display
        math={
          <Equations
            rows={[
              [
                <V key="w" n="w" sub="i" />,
                <>
                  <mn>1</mn>
                  <mo>+</mo>
                  <V n="d" sub="i" />
                  <mo>+</mo>
                  <V n="o" sub="i" />
                </>,
              ],
              [
                <V key="o" n="o" sub="i" />,
                <>
                  <mn>{ORDER_WEIGHT_MAX}</mn>
                  <mo>·</mo>
                  <Frac
                    num={
                      <>
                        <mi>n</mi>
                        <mo>−</mo>
                        <mn>1</mn>
                        <mo>−</mo>
                        <mi>i</mi>
                      </>
                    }
                    den={
                      <>
                        <mi>n</mi>
                        <mo>−</mo>
                        <mn>1</mn>
                      </>
                    }
                  />
                  <mo>·</mo>
                  <IversonDissonance />
                </>,
              ],
              [
                <mi key="mix">mix</mi>,
                <Frac
                  num={
                    <Sum index="i">
                      <V n="w" sub="i" />
                      <V n="color" sub="i" />
                    </Sum>
                  }
                  den={
                    <Sum index="i">
                      <V n="w" sub="i" />
                    </Sum>
                  }
                />,
              ],
            ]}
          />
        }
      >
        where <Formula math={<mi>i</mi>} /> is an interval&apos;s position in the list, starting at
        0; <Formula math={<mi>n</mi>} /> is the number of intervals in the list;{" "}
        <Formula math={<V n="d" sub="i" />} /> is the dissonance weight of its class;{" "}
        <Formula math={<V n="o" sub="i" />} /> is its order weight;{" "}
        <Formula math={<IversonDissonance />} /> is 1 when the interval has no dissonance and 0 when
        it does; and <Formula math={<V n="color" sub="i" />} /> is the color of its class.
      </Formula>

      <h2 className={LEARN_STYLES.h2}>5. Beyond triads</h2>

      <p>
        Add a B to C major to get Cmaj7 (C, E, G, B). The <i>perfect fifth</i> from C to G is no
        longer between neighboring notes, so from 4 notes up the <i>necklace</i> also gets
        diagonals: intervals spanning 2 neighbors, n ÷ 2 of them rounded down, sorted by size and
        added after the rest. Cmaj7 has 6 intervals in all:
      </p>

      <ChordColorBreakdown rootNote="C" chordType={ChordType.Major7} caption="Cmaj7" />

      <p>
        Each of the 6 carries a small share, and the more colors an average takes in, the less any
        one stands out. Add a 7th to both triads and their colors move closer:
      </p>

      <ComparisonGrid2>
        <ChordWheel
          rootNote="C"
          chordType={ChordType.Major7}
          inversionIndex={0}
          caption="Cmaj7"
          showKeyboard={false}
        />
        <ChordWheel
          rootNote="C"
          chordType={ChordType.Minor7}
          inversionIndex={0}
          caption="Cm7"
          showKeyboard={false}
        />
      </ComparisonGrid2>

      <p>
        Cmaj7 and Cm7 still differ, but by less than the triads do: the 1st goal gets harder as
        chords grow. Some chords even share a color by the 3rd goal, since Cm7 and E♭6 are the same
        4 notes. Read the color as a cue to a chord&apos;s character, and the name as the way to
        tell chords apart.
      </p>

      <SeeAlso items={["chord-quality", "symmetry-and-dissonance"]} />
    </>
  );
}
