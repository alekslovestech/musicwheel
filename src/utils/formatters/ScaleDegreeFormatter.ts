import { ScaleDegreeInfo } from "@/types/ScaleModes/ScaleDegreeInfo";

import { AccidentalFormatter } from "./AccidentalFormatter";

export class ScaleDegreeFormatter {
  static formatForDisplay(scaleDegreeInfo: ScaleDegreeInfo): string {
    const { accidentalPrefix, scaleDegree } = scaleDegreeInfo;
    const accidentalSign = AccidentalFormatter.getAccidentalSignForDisplay(accidentalPrefix);
    return `${accidentalSign}${scaleDegree.toString()}`;
  }
}
