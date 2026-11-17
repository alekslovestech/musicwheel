import { NextCard } from "@/components/Learn/prose/NextCard";
import { TrackedLink } from "@/components/Learn/prose/TrackedLink";
import { LEARN_STYLES } from "@/lib/design";
import {
  findLearnPath,
  LEARN_PAGES,
  LEARN_PATHS,
  pathContinuations,
  type LearnPageId,
  type LearnPageInfo,
} from "@/lib/learn/learnPages";

// After the last path there is nowhere to continue in order, so offer the whole index.
const ALL_ARTICLES: LearnPageInfo = {
  href: "/learn",
  title: "All articles",
  blurb: "",
};

/** Previous/Next within a reading path (see LEARN_PATHS), and where the path sits: "Chords · 2 of
 * 4". At the end of a path it offers the paths that follow instead of a Next. Only for a page in
 * a path; a standalone piece ends with a NextCard of its own. `compact` is the version for the top
 * of the page: position and titles only, no cards. */
export function ArticleNav({ id, compact = false }: { id: LearnPageId; compact?: boolean }) {
  const found = findLearnPath(id);
  if (!found) {
    throw new Error(`ArticleNav: "${id}" isn't in any of LEARN_PATHS`);
  }
  const { pathId, index } = found;
  const path = LEARN_PATHS[pathId];
  const pages: readonly LearnPageId[] = path.pages;
  const prevId = pages[index - 1];
  const nextId = pages[index + 1];

  if (compact) {
    return (
      <nav aria-label="Reading path" className="flex flex-col gap-tight text-sm">
        <TrackedLink href={path.href} placement="article-nav" className={LEARN_STYLES.pathPosition}>
          {path.title} · {index + 1} of {pages.length}
        </TrackedLink>
        {(prevId || nextId) && (
          <div className="flex justify-between gap-normal">
            <div>
              {prevId && (
                <TrackedLink
                  href={LEARN_PAGES[prevId].href}
                  placement="article-nav"
                  className={LEARN_STYLES.link}
                >
                  ← {LEARN_PAGES[prevId].title}
                </TrackedLink>
              )}
            </div>
            <div className="text-right">
              {nextId && (
                <TrackedLink
                  href={LEARN_PAGES[nextId].href}
                  placement="article-nav"
                  className={LEARN_STYLES.link}
                >
                  {LEARN_PAGES[nextId].title} →
                </TrackedLink>
              )}
            </div>
          </div>
        )}
      </nav>
    );
  }

  const following = pathContinuations(pathId);
  return (
    <nav
      aria-label="Article navigation"
      className="flex flex-col gap-snug border-t border-containers-divider pt-normal"
    >
      {nextId ? (
        <NextCard page={LEARN_PAGES[nextId]} label={`Next · ${path.title} ${index + 2} of ${pages.length}`} />
      ) : following.length > 0 ? (
        following.map((next) => (
          <NextCard key={next.href} page={next} label="Pick a topic" />
        ))
      ) : (
        <NextCard page={ALL_ARTICLES} label="Keep exploring" />
      )}
      {prevId && (
        <TrackedLink
          href={LEARN_PAGES[prevId].href}
          placement="article-nav"
          className={`${LEARN_STYLES.link} text-sm`}
        >
          ← Previous: {LEARN_PAGES[prevId].title}
        </TrackedLink>
      )}
    </nav>
  );
}
