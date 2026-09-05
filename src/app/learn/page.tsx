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
        <Link href="/learn/comparisons" className={LEARN_STYLES.link}>
          Comparisons
        </Link>
      </h2>
      <p>Two modes on the same tonic, one note apart.</p>
    </>
  );
}
