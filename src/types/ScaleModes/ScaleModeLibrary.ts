import { SCALE_MODE_PATTERNS } from "@/types/constants/ScaleModePatterns";

import { ScaleModeType } from "@/types/enums/ScaleModeType";

import { ScaleModeInfo } from "./ScaleModeInfo";

export class ScaleModeLibrary {
  private static instance: ScaleModeLibrary;
  private readonly modes: Record<ScaleModeType, ScaleModeInfo>;

  private constructor() {
    this.modes = {
      [ScaleModeType.Ionian]: new ScaleModeInfo(
        ScaleModeType.Ionian,
        SCALE_MODE_PATTERNS.IONIAN,
        1,
      ), // Major scale
      [ScaleModeType.Dorian]: new ScaleModeInfo(
        ScaleModeType.Dorian,
        SCALE_MODE_PATTERNS.DORIAN,
        2,
      ), // Minor with raised 6th
      [ScaleModeType.UkrainianDorian]: new ScaleModeInfo(
        ScaleModeType.UkrainianDorian,
        SCALE_MODE_PATTERNS.UKRAINIAN_DORIAN,
        2,
      ), // Dorian with #4
      [ScaleModeType.Phrygian]: new ScaleModeInfo(
        ScaleModeType.Phrygian,
        SCALE_MODE_PATTERNS.PHRYGIAN,
        3,
      ), // Minor with lowered 2nd
      [ScaleModeType.PhrygianDominant]: new ScaleModeInfo(
        ScaleModeType.PhrygianDominant,
        SCALE_MODE_PATTERNS.PHRYGIAN_DOMINANT,
        3,
      ),
      [ScaleModeType.Byzantine]: new ScaleModeInfo(
        ScaleModeType.Byzantine,
        SCALE_MODE_PATTERNS.BYZANTINE,
        3,
      ),
      [ScaleModeType.Lydian]: new ScaleModeInfo(
        ScaleModeType.Lydian,
        SCALE_MODE_PATTERNS.LYDIAN,
        4,
      ), // Major with raised 4th
      [ScaleModeType.Mixolydian]: new ScaleModeInfo(
        ScaleModeType.Mixolydian,
        SCALE_MODE_PATTERNS.MIXOLYDIAN,
        5,
      ), // Major with lowered 7th
      [ScaleModeType.Aeolian]: new ScaleModeInfo(
        ScaleModeType.Aeolian,
        SCALE_MODE_PATTERNS.AEOLIAN,
        6,
      ), // Natural minor scale
      [ScaleModeType.HarmonicMinor]: new ScaleModeInfo(
        ScaleModeType.HarmonicMinor,
        SCALE_MODE_PATTERNS.HARMONIC_MINOR,
        6,
      ), // Harmonic minor scale
      [ScaleModeType.HungarianMinor]: new ScaleModeInfo(
        ScaleModeType.HungarianMinor,
        SCALE_MODE_PATTERNS.HUNGARIAN_MINOR,
        6,
      ), // Hungarian minor scale
      [ScaleModeType.Locrian]: new ScaleModeInfo(
        ScaleModeType.Locrian,
        SCALE_MODE_PATTERNS.LOCRIAN,
        7,
      ), // Minor with lowered 2nd and 5th
    };
  }

  public static getInstance(): ScaleModeLibrary {
    if (!ScaleModeLibrary.instance) {
      ScaleModeLibrary.instance = new ScaleModeLibrary();
    }
    return ScaleModeLibrary.instance;
  }

  public static getModeInfo(type: ScaleModeType): ScaleModeInfo {
    return ScaleModeLibrary.getInstance().modes[type];
  }
}
