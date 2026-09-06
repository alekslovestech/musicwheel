import Link from "next/link";

import { LEARN_STYLES } from "@/lib/design";

/** Back-navigation for a comparison article, back to the /learn/scales/comparisons index. */
export function ComparisonsBackLink() {
  return (
    <Link href="/learn/scales/comparisons" className={LEARN_STYLES.link}>
      ← All comparisons
    </Link>
  );
}
