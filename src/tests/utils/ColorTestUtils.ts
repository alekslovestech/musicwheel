import chroma from "chroma-js";

function colorsEqual(a: chroma.Color, b: chroma.Color): boolean {
  return a.css() === b.css();
}

export function expectEqualColors(actual: chroma.Color, expected: chroma.Color): void {
  expect(colorsEqual(actual, expected)).toBe(true);
}

export function expectDistinctColors(actual: chroma.Color, expected: chroma.Color): void {  expect(colorsEqual(actual, expected)).toBe(false);
}
