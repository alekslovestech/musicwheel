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
    </>
  );
}
