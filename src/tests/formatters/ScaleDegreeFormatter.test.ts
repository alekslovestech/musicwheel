import { AccidentalType } from "@/types/enums/AccidentalType";

import { ixScaleDegree } from "@/types/ScaleModes/ScaleDegreeType";
import { ScaleDegreeInfo } from "@/types/ScaleModes/ScaleDegreeInfo";

import { ScaleDegreeFormatter } from "@/utils/formatters/ScaleDegreeFormatter";

describe("Scale Degree Info", () => {
  const testCases = [
    {
      desc: "1",
      degree: 1,
      accidental: undefined,
      expected: "1",
    },
    {
      desc: "♭1",
      degree: 1,
      accidental: AccidentalType.Flat,
      expected: "♭1",
    },
    {
      desc: "♯1",
      degree: 1,
      accidental: AccidentalType.Sharp,
      expected: "♯1",
    },
    {
      desc: "♭7",
      degree: 7,
      accidental: AccidentalType.Flat,
      expected: "♭7",
    },
  ];

  testCases.forEach(({ desc, degree, accidental, expected }) => {
    test(desc, () => {
      const scaleDegreeInfo = new ScaleDegreeInfo(
        ixScaleDegree(degree),
        accidental
      );
      expect(ScaleDegreeFormatter.formatForDisplay(scaleDegreeInfo)).toEqual(
        expected
      );
    });
  });
});
