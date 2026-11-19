import Link from "next/link";

import { LEARN_STYLES } from "@/lib/design";
import { LEARN_PAGES, type LearnPageId } from "@/lib/learn/learnPages";

/** The "← Section" link at the top of a learn page. `to` is the id of the page it sits under (see
 * LearnPageInfo.parent). */
export function BackLink({ to }: { to: LearnPageId }) {
  const { href, title } = LEARN_PAGES[to];
  return (
    <Link href={href} className={LEARN_STYLES.link}>
      ← {title}
    </Link>
  );
}
