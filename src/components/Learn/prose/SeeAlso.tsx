import Link from "next/link";

import { LEARN_STYLES } from "@/lib/design";
import { LEARN_PAGES, type LearnPageId, type LearnPageInfo } from "@/lib/learn/learnPages";

/** A page in LEARN_PAGES by id alone, or with a blurb of its own where the reason for the link
 * matters more than the page's topic; any other page gives its own href, title and blurb. */
export type SeeAlsoItem = LearnPageId | { id: LearnPageId; blurb: string } | LearnPageInfo;

function resolveItem(item: SeeAlsoItem): LearnPageInfo {
  if (typeof item === "string") return LEARN_PAGES[item];
  if ("id" in item) return { ...LEARN_PAGES[item.id], blurb: item.blurb };
  return item;
}

/** Onward reading at the end of an article. For a link that supports a specific claim, link
 * inline in the prose instead - this is for pages the article doesn't depend on. */
export function SeeAlso({
  items,
  title = "See also",
}: {
  items: readonly SeeAlsoItem[];
  /** Name the section when the links share a kind, e.g. "Scale Comparisons". */
  title?: string;
}) {
  return (
    <aside className={LEARN_STYLES.seeAlso}>
      <h2 className={LEARN_STYLES.blockTitle}>{title}</h2>
      <ul className={LEARN_STYLES.seeAlsoList}>
        {items.map(resolveItem).map(({ href, title: pageTitle, blurb }) => (
          <li key={href}>
            <Link href={href} className={LEARN_STYLES.link}>
              {pageTitle}
            </Link>
            <span className="block text-labels-textDefault">{blurb}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
