import { existsSync, readdirSync, readFileSync } from "fs";
import { join } from "path";

import {
  findLearnPath,
  LEARN_GROUPS,
  LEARN_PAGES,
  LEARN_PATH_ORDER,
  LEARN_PATHS,
  learnTopicOf,
  type LearnPageId,
} from "@/lib/learn/learnPages";

function sourceAt(href: string): string {
  return readFileSync(join(process.cwd(), "src/app", href, "page.tsx"), "utf-8");
}

function pageSource(id: LearnPageId): string {
  return sourceAt(LEARN_PAGES[id].href);
}

const ALL_IDS = Object.keys(LEARN_PAGES) as LearnPageId[];
// Index pages build their own listing instead of using ArticlePage.
const ARTICLE_IDS = ALL_IDS.filter((id) => !("isIndex" in LEARN_PAGES[id]));

const pathPages: LearnPageId[] = Object.values(LEARN_PATHS).flatMap((path) => [...path.pages]);

describe("LEARN_PAGES", () => {
  it.each(Object.entries(LEARN_PAGES))("%s is a page that exists", (_id, { href }) => {
    expect(existsSync(join(process.cwd(), "src/app", href, "page.tsx"))).toBe(true);
  });

  it("keys each page by the last segment of its route", () => {
    for (const [id, { href }] of Object.entries(LEARN_PAGES)) {
      expect(href.split("/").pop()).toBe(id);
    }
  });

  it("points every thumbnail at an image that exists", () => {
    for (const page of Object.values(LEARN_PAGES)) {
      if (!("thumbnail" in page)) continue;
      expect(existsSync(join(process.cwd(), "public/thumbnails", `${page.thumbnail}.png`))).toBe(
        true,
      );
    }
  });

  it("gives every page but Learn a parent page, leading up to Learn", () => {
    for (const id of ALL_IDS) {
      if (id === "learn") continue;
      const { parent } = LEARN_PAGES[id] as { parent?: string };
      expect(parent).toBeDefined();
      expect(parent! in LEARN_PAGES).toBe(true);
      expect(() => learnTopicOf(id)).not.toThrow();
    }
  });
});

describe("ArticlePage", () => {
  it.each(ARTICLE_IDS)("%s is wrapped in ArticlePage with its own id", (id) => {
    expect(pageSource(id)).toMatch(new RegExp(`<ArticlePage\\s+id="${id}"`));
  });

  it("wraps every scale comparison, under the comparisons section", () => {
    const dir = join(process.cwd(), "src/app/learn/scales/comparisons");
    const pages = readdirSync(dir, { withFileTypes: true }).filter((entry) => entry.isDirectory());
    expect(pages.length).toBeGreaterThan(0);
    for (const { name } of pages) {
      expect(sourceAt(`/learn/scales/comparisons/${name}`)).toMatch(
        /<ArticlePage\s+parent="comparisons"/,
      );
    }
  });

  it("leaves the navigation blocks to the wrapper", () => {
    for (const id of ARTICLE_IDS) {
      const source = pageSource(id);
      expect(source).not.toContain("<ArticleNav");
      expect(source).not.toContain("<NextCard");
      expect(source).not.toContain("<SeeAlso");
    }
  });
});

describe("LEARN_PATHS", () => {
  it("lists every path in LEARN_PATH_ORDER", () => {
    expect([...LEARN_PATH_ORDER].sort()).toEqual(Object.keys(LEARN_PATHS).sort());
  });

  it("puts each page in at most one path", () => {
    expect(new Set(pathPages).size).toBe(pathPages.length);
  });

  it("keeps a page out of a path and a grouping at once", () => {
    const grouped: LearnPageId[] = Object.values(LEARN_GROUPS).flatMap((group) => [...group.pages]);
    expect(grouped.filter((id) => pathPages.includes(id))).toEqual([]);
  });

  it("finds every path page's position", () => {
    for (const id of pathPages) {
      expect(findLearnPath(id)).toBeDefined();
    }
  });
});
