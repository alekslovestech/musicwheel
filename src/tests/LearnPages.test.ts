import { existsSync } from "fs";
import { join } from "path";

import { LEARN_PAGES } from "@/lib/learn/learnPages";

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
