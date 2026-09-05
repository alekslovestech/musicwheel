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

      <ul className="flex list-none flex-col gap-snug p-0">
        <li>
          <Link href="/learn/aeolian-vs-dorian" className={LEARN_STYLES.link}>
            Aeolian vs. Dorian: one note apart
          </Link>
        </li>
        <li>
          <Link href="/learn/phrygian-vs-phrygian-dominant" className={LEARN_STYLES.link}>
            Phrygian vs. Phrygian Dominant: one note apart
          </Link>
        </li>
        <li>
          <Link href="/learn/dorian-vs-ukrainian-dorian" className={LEARN_STYLES.link}>
            Dorian vs. Ukrainian Dorian: one note apart
          </Link>
        </li>
      </ul>
    </>
  );
}
