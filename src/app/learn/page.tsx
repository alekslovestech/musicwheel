import Link from "next/link";

import { LearnTags } from "@/components/Learn/LearnTags";
import { LEARN_STYLES } from "@/lib/design";
import { LearnTag } from "@/types/enums/LearnTag";

export default function LearnIndexPage() {
  return (
    <>
      <h1 className={LEARN_STYLES.h1}>Learn</h1>
      <p>
        Short written pieces about the ideas the wheel is built around. Every figure is the real
        wheel, drawn from the same code the app runs - but held still, so you can read it before you
        go and play with it.
      </p>

      <h2 className={LEARN_STYLES.h2}>
        <Link href="/learn/approach" className={LEARN_STYLES.sectionLink}>
          Approach
        </Link>
      </h2>
      <p>
        The opinions behind this app: what&apos;s wrong with how music theory usually gets taught,
        and what we do about it.
      </p>

      <h2 className={LEARN_STYLES.h2}>
        <Link href="/learn/scales" className={LEARN_STYLES.sectionLink}>
          Scales
        </Link>
      </h2>
      <p>
        How the modes relate to each other, what &ldquo;harmonic&rdquo; and &ldquo;melodic&rdquo;
        actually mean, and pairs that differ by exactly one note.
      </p>

      <h2 className={LEARN_STYLES.h2}>
        <Link href="/learn/major-vs-minor-triads" className={LEARN_STYLES.link}>
          Major and Minor Triads
        </Link>
        <LearnTags tags={[LearnTag.BasicConcepts, LearnTag.Essential]} />
      </h2>
      <p>The two most common chords in Western music - one semitone apart on the third.</p>

      <h2 className={LEARN_STYLES.h2}>
        <Link href="/learn/triad-inversions" className={LEARN_STYLES.link}>
          Triad Inversions
        </Link>
        <LearnTags tags={[LearnTag.BasicConcepts, LearnTag.Essential]} />
      </h2>
      <p>Same three notes, different note on the bottom.</p>

      <h2 className={LEARN_STYLES.h2}>
        <Link href="/learn/interval-inversions" className={LEARN_STYLES.link}>
          Interval Inversions
        </Link>
        <LearnTags tags={[LearnTag.BasicConcepts]} />
      </h2>
      <p>
        Flip an interval upside down and the number changes - but a minor 2nd and a major 7th still
        sound like close relatives.
      </p>

      <h2 className={LEARN_STYLES.h2}>
        <Link href="/learn/symmetry-and-dissonance" className={LEARN_STYLES.link}>
          Symmetry and Dissonance
        </Link>
        <LearnTags tags={[LearnTag.Geometry]} />
      </h2>
      <p>
        Why the tritone, the augmented triad, and the diminished 7th all sound unsettled: split the
        octave evenly and no note is left to call home.
      </p>
    </>
  );
}
