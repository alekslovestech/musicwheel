import Link from "next/link";

import { LEARN_STYLES } from "@/lib/design";

export interface SeeAlsoItem {
  href: string;
  title: string;
  /** One line on why the reader would care - not a summary of the page. */
  blurb: string;
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
        {items.map(({ href, title, blurb }) => (
          <li key={href}>
            <Link href={href} className={LEARN_STYLES.link}>
              {title}
            </Link>
            <span className="block text-labels-textDefault">{blurb}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
