import {
  createParsedRomanString,
  RomanParser,
} from "@/utils/resolvers/RomanParser";

describe("SplitRomanString tests", () => {
  const testCases = [
    {
      desc: "Basic numeral",
      input: "I",
      expected: createParsedRomanString("", "I", "", undefined),
    },
    {
      desc: "Sharp accidental",
      input: "♯I",
      expected: createParsedRomanString("♯", "I", "", undefined),
    },
    {
      desc: "Flat accidental",
      input: "♭I",
      expected: createParsedRomanString("♭", "I", "", undefined),
    },
    {
      desc: "Flat minor",
      input: "♭iii",
      expected: createParsedRomanString("♭", "iii", "", undefined),
    },
    {
      desc: "Dominant 7",
      input: "I7",
      expected: createParsedRomanString("", "I", "7", undefined),
    },
    {
      desc: "Augmented",
      input: "I+",
      expected: createParsedRomanString("", "I", "+", undefined),
    },
    {
      desc: "Major 7",
      input: "Imaj7",
      expected: createParsedRomanString("", "I", "maj7", undefined),
    },
    {
      desc: "Sharp with major 7",
      input: "♯Imaj7",
      expected: createParsedRomanString("♯", "I", "maj7", undefined),
    },
    {
      desc: "Major/major slash chord",
      input: "I/V",
      expected: createParsedRomanString("", "I", "", "V"),
    },
    {
      desc: "Major/minor slash chord",
      input: "I/v",
      expected: createParsedRomanString("", "I", "", "v"),
    },
    {
      desc: "Minor/major slash chord",
      input: "i/V",
      expected: createParsedRomanString("", "i", "", "V"),
    },
  ];

  testCases.forEach(({ desc, input, expected }) => {
    test(desc, () => {
      expect(RomanParser.splitRomanString(input)).toEqual(expected);
    });
  });

  test("Invalid slash chord throws error", () => {
    expect(() => RomanParser.splitRomanString("I/V/VII")).toThrow();
  });
});
