import Link from "next/link";

import { LEARN_STYLES } from "@/lib/design";

export default function LearnIndexPage() {
  return (
    <>
      <h1 className="text-3xl font-semibold">Learn</h1>
      <p>
        Short written pieces about the ideas the wheel is built around. Every figure is the real
        wheel, drawn from the same code the app runs - but held still, so you can read it before you
        go and play with it.
      </p>

      <h2 className="text-xl font-semibold">
        <Link href="/learn/why-this-app" className={LEARN_STYLES.link}>
          Why This App
        </Link>
      </h2>
      <p>
        The problems we&apos;re trying to solve: what matters about harmony, and what&apos;s just
        historical noise.
      </p>

      <h2 className="text-xl font-semibold">
        <Link href="/learn/scales" className={LEARN_STYLES.link}>
          Scales
        </Link>
      </h2>
      <p>
        How the modes relate to each other, what &ldquo;harmonic&rdquo; and &ldquo;melodic&rdquo;
        actually mean, and pairs that differ by exactly one note.
      </p>

      <h2 className="text-xl font-semibold">
        <Link href="/learn/triad-inversions" className={LEARN_STYLES.link}>
          Triad Inversions
        </Link>
      </h2>
      <p>Same three notes, different note on the bottom.</p>

      <h2 className="text-xl font-semibold">
        <Link href="/learn/interval-inversions" className={LEARN_STYLES.link}>
          Interval Inversions
        </Link>
      </h2>
      <p>
        Flip an interval upside down and the number changes - but a minor 2nd and a major 7th still
        sound like close relatives.
      </p>

      <h2 className="text-xl font-semibold">
        <Link href="/learn/color-coding" className={LEARN_STYLES.link}>
          Color Coding
        </Link>
      </h2>
      <p>What the colors on the wheel, the ribbon, and every legend actually mean.</p>

      <h2 className="text-xl font-semibold">
        <Link href="/learn/symmetry-and-dissonance" className={LEARN_STYLES.link}>
          Symmetry and Dissonance
        </Link>
      </h2>
      <p>
        Why the tritone, the augmented triad, and the diminished 7th all sound unsettled: split the
        octave evenly and no note is left to call home.
      </p>
    </>
  );
}
