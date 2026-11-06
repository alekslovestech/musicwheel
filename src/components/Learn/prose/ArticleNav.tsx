import Link from "next/link";

import { LEARN_STYLES } from "@/lib/design";
import { APPROACH_SEQUENCE, LEARN_PAGES, type LearnPageId } from "@/lib/learn/learnPages";

function NavLink({ id, direction }: { id: LearnPageId; direction: "prev" | "next" }) {
  const { href, title, blurb } = LEARN_PAGES[id];
  return (
    <Link
      href={href}
      className={`flex flex-col gap-tight no-underline ${direction === "next" ? "text-right" : ""}`}
    >
      <span className={`text-xs uppercase tracking-wide text-labels-textDefault opacity-60`}>
        {direction === "prev" ? "← Previous" : "Next →"}
      </span>
      <span className={LEARN_STYLES.link}>{title}</span>
      <span className="text-sm text-labels-textDefault">{blurb}</span>
    </Link>
  );
}

/** Previous/Next between the neighbors of a spine article (see APPROACH_SEQUENCE) - the
 * continuous path through the Approach section's introductory sequence. Only for a page in that
 * sequence; anything else links through SeeAlso instead. `compact` is the one-line version for
 * the top of the page: titles only, no blurbs. */
export function ArticleNav({ id, compact = false }: { id: LearnPageId; compact?: boolean }) {
  const index = APPROACH_SEQUENCE.indexOf(id);
  if (index === -1) {
    throw new Error(`ArticleNav: "${id}" isn't in APPROACH_SEQUENCE`);
  }
  const prevId = index > 0 ? APPROACH_SEQUENCE[index - 1] : undefined;
  const nextId = index < APPROACH_SEQUENCE.length - 1 ? APPROACH_SEQUENCE[index + 1] : undefined;
  if (!prevId && !nextId) return null;

  if (compact) {
    return (
      <nav
        aria-label="Previous and next article"
        className="flex justify-between gap-normal text-sm"
      >
        <div>
          {prevId && (
            <Link href={LEARN_PAGES[prevId].href} className={LEARN_STYLES.link}>
              ← {LEARN_PAGES[prevId].title}
            </Link>
          )}
        </div>
        <div className="text-right">
          {nextId && (
            <Link href={LEARN_PAGES[nextId].href} className={LEARN_STYLES.link}>
              {LEARN_PAGES[nextId].title} →
            </Link>
          )}
        </div>
      </nav>
    );
  }

  return (
    <nav
      aria-label="Article navigation"
      className="flex flex-col gap-normal border-t border-containers-divider pt-normal sm:flex-row sm:justify-between"
    >
      <div className="sm:w-1/2">{prevId && <NavLink id={prevId} direction="prev" />}</div>
      <div className="sm:w-1/2">{nextId && <NavLink id={nextId} direction="next" />}</div>
    </nav>
  );
}
