import type { Metadata } from "next";
import Link from "next/link";

import { ArticlePage } from "@/components/Learn/layout/ArticlePage";
import { ChordWheel } from "@/components/Learn/figures/ChordWheel";
import { LEARN_STYLES } from "@/lib/design";
import { learnViewMetadata, metadataForSlugPage } from "@/lib/metadata";
import { SpecialType } from "@/types/enums/SpecialType";

export const metadata: Metadata = metadataForSlugPage(
  learnViewMetadata,
  "/learn/approach/chromatic-circle",
  "The Chromatic Circle",
  "Why arranging the 12 notes in a circle instead of a line makes intervals and inversions easier to see - and how it compares to the circle of fifths and the Tonnetz.",
  {
    slug: "chromatic-circle",
    alt: "The chromatic circle: the 12 notes arranged as a ring of white and black wedges",
  },
);

export default function ChromaticCirclePage() {
  return (
    <ArticlePage
      id="chromatic-circle"
      seeAlso={["color-coding", "symmetry-and-dissonance"]}
    >
      <h1 className={LEARN_STYLES.h1}>The Chromatic Circle</h1>

      <p>
        A keyboard or a staff lays the 12 notes out in a line. The chromatic circle bends that same
        line into a loop, so the note after B is C again. The piano is a familiar layout and a
        convenient way to play a sound back, but its arrangement of black and white keys
        doesn&apos;t explain the harmony.
      </p>

      <ChordWheel
        rootNote="C"
        chordType={SpecialType.None}
        inversionIndex={0}
        caption="The 12 notes as a circle."
        isCompact
        showLabels
        showKeyboard={false}
        narrow
      />

      <h2 className={LEARN_STYLES.h2}>What a circle makes easy</h2>

      <p>
        On a line, where an interval or chord sits changes how it looks, for example depending on
        whether it starts on a black or a white key. On the circle, an interval is an angular
        distance between 2 points, and a chord is a shape made of several points. Moving either to
        a different starting note rotates it without changing it.{" "}
        <Link href="/learn/approach/music-theory-on-the-chromatic-circle" className={LEARN_STYLES.link}>
          Music Theory on the Chromatic Circle
        </Link>{" "}
        walks through intervals, chords, progressions and scales this way.
      </p>

      <p>
        The same circle makes inversions visible. An{" "}
        <Link href="/learn/interval-inversions" className={LEARN_STYLES.link}>
          interval&apos;s inversion
        </Link>{" "}
        is the same 2 points read around the circle the other way; a{" "}
        <Link href="/learn/chords/triad-inversions" className={LEARN_STYLES.link}>
          chord&apos;s inversion
        </Link>{" "}
        is the same wedges lit up with a different bass note marked.
      </p>

      <h2 className={LEARN_STYLES.h2}>Other ways to arrange the 12 notes</h2>

      <p>
        What tells these arrangements apart is which interval puts 2 notes next to each other. On
        the chromatic circle it is 1 semitone.
      </p>

      <p>
        The{" "}
        <Link
          href="https://www.circlefifth.com/app"
          className={LEARN_STYLES.link}
          target="_blank"
          rel="noopener noreferrer"
        >
          circle of fifths
        </Link>{" "}
        orders the notes by <i>perfect fifth</i>&nbsp; instead of by semitone. That puts keys that share
        most of their notes next to each other, which is why it&apos;s the usual way to explain key
        signatures, and it turns a ii–V–I into a run of adjacent steps. The cost is that interval
        sizes get scrambled: a perfect fifth is 1 step away, and a semitone is 5 steps away. Shapes
        still rotate on it, but a shape&apos;s size is harder to read at a glance.
      </p>

      <p>
        The Tonnetz goes a step further and arranges the notes on a lattice with 3 kinds of
        neighbor: a <i>perfect fifth</i>, a <i>major third</i> and a <i>minor third</i>. Triads
        become triangles, and triads that differ by only 1 note sit side by side. It&apos;s worth a
        look if you&apos;re curious how chords relate, and there is an interactive one at{" "}
        <Link
          href="https://thetonnetz.com/"
          className={LEARN_STYLES.link}
          target="_blank"
          rel="noopener noreferrer"
        >
          thetonnetz.com
        </Link>
        .
      </p>
    </ArticlePage>
  );
}
