import { ScaleModeType } from "@/types/enums/ScaleModeType";

export enum ScaleModeGroup {
  Greek = "greek",
  HarmonicMinor = "harmonicMinor",
  HarmonicMajor = "harmonicMajor",
  DoubleHarmonic = "doubleHarmonic",
  Other = "other",
}

export function getScaleModeGroup(mode: ScaleModeType): ScaleModeGroup {
  switch (mode) {
    case ScaleModeType.Ionian:
    case ScaleModeType.Dorian:
    case ScaleModeType.Phrygian:
    case ScaleModeType.Lydian:
    case ScaleModeType.Mixolydian:
    case ScaleModeType.Aeolian:
    case ScaleModeType.Locrian:
      return ScaleModeGroup.Greek;

    case ScaleModeType.HarmonicMinor:
    case ScaleModeType.PhrygianDominant:
      return ScaleModeGroup.HarmonicMinor;

    case ScaleModeType.HarmonicMajor:
    case ScaleModeType.MixolydianB2:
      return ScaleModeGroup.HarmonicMajor;

    case ScaleModeType.DoubleHarmonicMajor:
    case ScaleModeType.HungarianMinor:
      return ScaleModeGroup.DoubleHarmonic;

    default:
      return ScaleModeGroup.Other;
  }
}
