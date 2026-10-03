import { AccidentalType } from "@/types/enums/AccidentalType";
import { ChordType } from "@/types/enums/ChordType";
import { OctaveModifier } from "@/types/enums/OctaveModifier";
import { ScaleDegree } from "./ScaleModes/ScaleDegreeType";
export class RomanChord {
  scaleDegree: ScaleDegree;
  chordType: ChordType;
  accidental: AccidentalType;
  bassDegree: ScaleDegree | undefined;
  /**
   * Explicit LilyPond-style octave marker (`'` = Up, `,` = Down) from the roman token, 
   */
  octaveOverride: OctaveModifier | undefined;
  constructor(
    scaleDegree: ScaleDegree,
    chordType: ChordType,
    accidental: AccidentalType = AccidentalType.None,
    bassDegree: ScaleDegree | undefined = undefined,
    octaveOverride: OctaveModifier | undefined = undefined,
  ) {
    this.scaleDegree = scaleDegree;
    this.chordType = chordType;
    this.accidental = accidental;
    this.bassDegree = bassDegree;
    this.octaveOverride = octaveOverride;
  }
}
