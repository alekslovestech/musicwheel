import { TrackedLink } from "@/components/Learn/prose/TrackedLink";
import { LEARN_STYLES } from "@/lib/design";
import { LEARN_PAGES, type LearnPageId } from "@/lib/learn/learnPages";

/** A pointer to another page placed where its question comes up in the text, rather than saved
 * for the end. Shows the page's question-style blurb unless given one. At most 1 or 2 per article;
 * a page linked this way doesn't also go in that article's SeeAlso. */
export function Aside({ id, question }: { id: LearnPageId; question?: string }) {
  const page = LEARN_PAGES[id];
  return (
    <p className={LEARN_STYLES.aside}>
      <TrackedLink href={page.href} placement="aside" className={LEARN_STYLES.link}>
        {question ?? page.blurb} →
      </TrackedLink>
    </p>
  );
}
