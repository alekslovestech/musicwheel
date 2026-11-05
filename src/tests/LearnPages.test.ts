import { existsSync, readFileSync } from "fs";
import { join } from "path";

import { APPROACH_SEQUENCE, LEARN_PAGES } from "@/lib/learn/learnPages";

describe("LEARN_PAGES", () => {
  it.each(Object.entries(LEARN_PAGES))("%s is a page that exists", (_id, { href }) => {
    expect(existsSync(join(process.cwd(), "src/app", href, "page.tsx"))).toBe(true);
  });

  it("keys each page by the last segment of its route", () => {
    for (const [id, { href }] of Object.entries(LEARN_PAGES)) {
      expect(href.split("/").pop()).toBe(id);
    }
  });
});

describe("APPROACH_SEQUENCE", () => {
  it("only lists ids that are in LEARN_PAGES", () => {
    for (const id of APPROACH_SEQUENCE) {
      expect(LEARN_PAGES).toHaveProperty(id);
    }
  });

  it("has no duplicate ids", () => {
    expect(new Set(APPROACH_SEQUENCE).size).toBe(APPROACH_SEQUENCE.length);
  });

  it("every spine page renders an ArticleNav for its own id", () => {
    for (const id of APPROACH_SEQUENCE) {
      const href = LEARN_PAGES[id].href;
      const source = readFileSync(join(process.cwd(), "src/app", href, "page.tsx"), "utf-8");
      expect(source).toContain(`<ArticleNav id="${id}" />`);
    }
  });
});
