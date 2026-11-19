import { TrackedLink } from "@/components/Learn/prose/TrackedLink";
import { LEARN_STYLES } from "@/lib/design";
import { LEARN_PAGES, type LearnPageId, type LearnPageInfo } from "@/lib/learn/learnPages";

/** A page in LEARN_PAGES by id alone, or with a blurb of its own where the reason for the link
 * matters more than the page's topic; any other page gives its own href, title and blurb. */
export type SeeAlsoItem = LearnPageId | { id: LearnPageId; blurb: string } | LearnPageInfo;

// More than this and the block reads as a footer rather than a choice.
const MAX_ITEMS = 3;

function resolveItem(item: SeeAlsoItem): LearnPageInfo {
  if (typeof item === "string") return LEARN_PAGES[item];
  if ("id" in item) return { ...LEARN_PAGES[item.id], blurb: item.blurb };
  return item;
}

/** Secondary onward reading at the end of an article, after its NextCard or ArticleNav. See
 * CLAUDE.md for when to use it and how to order the items. */
export function SeeAlso({
  items,
  title = "See also",
}: {
  items: readonly SeeAlsoItem[];
  /** Name the section when the links share a kind, e.g. "Scale Comparisons". */
  title?: string;
}) {
  if (items.length > MAX_ITEMS) {
    throw new Error(`SeeAlso: ${items.length} items, at most ${MAX_ITEMS}`);
  }
  return (
    <aside className={LEARN_STYLES.seeAlso}>
      <h2 className={LEARN_STYLES.blockTitle}>{title}</h2>
      <ul className={LEARN_STYLES.seeAlsoList}>
        {items.map(resolveItem).map(({ href, title: pageTitle, blurb }) => (
          <li key={href}>
            <TrackedLink href={href} placement="see-also" className={LEARN_STYLES.link}>
              {pageTitle}
            </TrackedLink>
            <span className="block text-labels-textDefault">{blurb}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
