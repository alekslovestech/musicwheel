import type { ReactNode } from "react";

import { BackLink } from "@/components/Learn/layout/BackLink";
import { ArticleNav } from "@/components/Learn/prose/ArticleNav";
import { NextCard } from "@/components/Learn/prose/NextCard";
import { SeeAlso, type SeeAlsoItem } from "@/components/Learn/prose/SeeAlso";
import {
  findLearnPath,
  LEARN_PAGES,
  learnPathEntry,
  learnTopicOf,
  type LearnPageId,
  type LearnPageInfo,
} from "@/lib/learn/learnPages";

type ArticlePageProps = {
  children: ReactNode;
  /** Onward reading that isn't the page's path neighbor; see SeeAlso and CLAUDE.md. */
  seeAlso?: readonly SeeAlsoItem[];
  seeAlsoTitle?: string;
} & (
  // A page in LEARN_PAGES: its parent, and its place in a path, come from the registry.
  | { id: LearnPageId; parent?: never }
  // A page that isn't in LEARN_PAGES (the scale comparisons) says where its back link goes.
  | { id?: never; parent: LearnPageId }
);

/** The frame every learn article shares: the back link, the position in a reading path, then the
 * page's content, then one recommended next step, then its See also. The next step depends on
 * where the page sits (see CLAUDE.md):
 * - in a reading path: ArticleNav, with Previous/Next and the end-of-path cards;
 * - a scales page outside the path: the Scales path;
 * - any other page: The Chromatic Circle, the start of the spine. */
export function ArticlePage({ id, parent, seeAlso, seeAlsoTitle, children }: ArticlePageProps) {
  const parentId =
    parent ??
    (id === undefined
      ? undefined
      : ((LEARN_PAGES[id] as LearnPageInfo).parent as LearnPageId | undefined));
  if (!parentId) throw new Error(`ArticlePage: "${id}" has no parent in LEARN_PAGES`);

  // The id again, only when the page sits in a reading path.
  const pathPageId = id !== undefined && findLearnPath(id) !== undefined ? id : undefined;
  const isScales = learnTopicOf(parentId) === "scales";

  return (
    <>
      <BackLink to={parentId} />
      {pathPageId && <ArticleNav id={pathPageId} compact />}

      {children}

      {pathPageId ? (
        <ArticleNav id={pathPageId} />
      ) : isScales ? (
        <NextCard page={learnPathEntry("scales")} label="Start the Scales path" />
      ) : (
        <NextCard page={LEARN_PAGES["chromatic-circle"]} label="Start here" />
      )}
      {seeAlso && <SeeAlso items={seeAlso} title={seeAlsoTitle} />}
    </>
  );
}
