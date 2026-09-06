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
        <Link href="/learn/greek-modes" className={LEARN_STYLES.link}>
          How the Greek Modes Relate to Each Other
        </Link>
      </h2>
      <p>Relative modes, parallel modes, and one scale rotated seven ways.</p>

      <h2 className="text-xl font-semibold">
        <Link href="/learn/relative-vs-parallel-modes" className={LEARN_STYLES.link}>
          Relative vs. Parallel Modes
        </Link>
      </h2>
      <p>Same notes, different tonic - or the same tonic, different notes.</p>

      <h2 className="text-xl font-semibold">
        <Link href="/learn/comparisons" className={LEARN_STYLES.link}>
          Comparisons
        </Link>
      </h2>
      <p>Two modes on the same tonic, one note apart.</p>

      <h2 className="text-xl font-semibold">
        <Link href="/learn/harmonic-scales" className={LEARN_STYLES.link}>
          What Makes a Scale “Harmonic”?
        </Link>
      </h2>
      <p>What the name actually means, and the gap it leaves behind.</p>

      <h2 className="text-xl font-semibold">
        <Link href="/learn/melodic-scales" className={LEARN_STYLES.link}>
          What Makes a Scale “Melodic”?
        </Link>
      </h2>
      <p>The same gap, closed back up - and what that costs.</p>

      <h2 className="text-xl font-semibold">
        <Link href="/learn/triad-inversions" className={LEARN_STYLES.link}>
          Triad Inversions
        </Link>
      </h2>
      <p>Same three notes, different note on the bottom.</p>
    </>
  );
}
