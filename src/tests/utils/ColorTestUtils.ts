import { AppColor, colorsEqual } from "@/utils/visual/AppColor";

export function expectEqualColors(actual: AppColor, expected: AppColor): void {
  expect(colorsEqual(actual, expected)).toBe(true);
}

export function expectDistinctColors(actual: AppColor, expected: AppColor): void {
  expect(colorsEqual(actual, expected)).toBe(false);
}
