import { AccidentalType } from "@/types/enums/AccidentalType";
import { ChordType } from "@/types/enums/ChordType";
import { RomanChord } from "@/types/RomanChord";
import { ixScaleDegree, ScaleDegree } from "@/types/ScaleModes/ScaleDegreeType";

export function makeRomanChord(
  scaleDegree: number,
  chordType: ChordType,
  accidental: AccidentalType = AccidentalType.None,
  bassScaleDegree?: ScaleDegree,
): RomanChord {
  const bass = bassScaleDegree ?? undefined;
  return new RomanChord(ixScaleDegree(scaleDegree), chordType, accidental, bass);
}

