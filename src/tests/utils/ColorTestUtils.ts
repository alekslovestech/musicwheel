import { AppColor } from "@/utils/visual/AppColor";

function colorsEqual(a: AppColor, b: AppColor): boolean {
  return a.css() === b.css();
}

export function expectEqualColors(actual: AppColor, expected: AppColor): void {
  expect(colorsEqual(actual, expected)).toBe(true);
}

export function expectDistinctColors(actual: AppColor, expected: AppColor): void {
  expect(colorsEqual(actual, expected)).toBe(false);
}
