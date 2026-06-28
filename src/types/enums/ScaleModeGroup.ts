import { ScaleModeType } from "@/types/enums/ScaleModeType";

export enum ScaleModeGroup {
  Greek = "greek",
  HarmonicMinor = "harmonicMinor",
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

    default:
      return ScaleModeGroup.Other;
  }
}
