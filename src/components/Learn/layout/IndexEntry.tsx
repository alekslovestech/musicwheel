import Link from "next/link";
import type { ReactNode } from "react";

import { LearnTags } from "@/components/Learn/layout/LearnTags";
import { LEARN_STYLES } from "@/lib/design";
import { LEARN_PAGES, type LearnPageId, type LearnPageInfo } from "@/lib/learn/learnPages";

/** One entry in a learn index page: the linked title (with the page's topic tags) and, as
 * children, the blurb under it. The title, tags and link style come from LEARN_PAGES; a link to
 * another index page is drawn in the section style. The blurb is written for the index and is
 * longer than the registry's one-question blurb, which is what cards and See also use. */
export function IndexEntry({ id, children }: { id: LearnPageId; children: ReactNode }) {
  const page: LearnPageInfo = LEARN_PAGES[id];
  return (
    <>
      <h2 className={LEARN_STYLES.h2}>
        <Link href={page.href} className={page.isIndex ? LEARN_STYLES.sectionLink : LEARN_STYLES.link}>
          {page.title}
        </Link>
        {page.tags && <LearnTags tags={page.tags} />}
      </h2>
      <p>{children}</p>
    </>
  );
}
