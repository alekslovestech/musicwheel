import { SCALE_MODE_PATTERNS } from "@/types/constants/ScaleModePatterns";

import { ScaleModeType } from "@/types/enums/ScaleModeType";
import { buildSlugMap } from "@/utils/slug/slugCodec";

import { ScaleModeInfo } from "./ScaleModeInfo";

export const SCALE_MODE_REGISTRY: Record<ScaleModeType, ScaleModeInfo> = {
  [ScaleModeType.Ionian]: new ScaleModeInfo(
    ScaleModeType.Ionian,
    "ionian",
    SCALE_MODE_PATTERNS.IONIAN,
    1,
  ), // Major scale
  [ScaleModeType.Dorian]: new ScaleModeInfo(
    ScaleModeType.Dorian,
    "dorian",
    SCALE_MODE_PATTERNS.DORIAN,
    2,
  ), // Minor with raised 6th
  [ScaleModeType.Phrygian]: new ScaleModeInfo(
    ScaleModeType.Phrygian,
    "phrygian",
    SCALE_MODE_PATTERNS.PHRYGIAN,
    3,
  ), // Minor with lowered 2nd
  [ScaleModeType.Lydian]: new ScaleModeInfo(
    ScaleModeType.Lydian,
    "lydian",
    SCALE_MODE_PATTERNS.LYDIAN,
    4,
  ), // Major with raised 4th
  [ScaleModeType.Mixolydian]: new ScaleModeInfo(
    ScaleModeType.Mixolydian,
    "mixolydian",
    SCALE_MODE_PATTERNS.MIXOLYDIAN,
    5,
  ), // Major with lowered 7th
  [ScaleModeType.Aeolian]: new ScaleModeInfo(
    ScaleModeType.Aeolian,
    "aeolian",
    SCALE_MODE_PATTERNS.AEOLIAN,
    6,
  ), // Natural minor scale
  [ScaleModeType.Locrian]: new ScaleModeInfo(
    ScaleModeType.Locrian,
    "locrian",
    SCALE_MODE_PATTERNS.LOCRIAN,
    7,
  ), // Minor with lowered 2nd and 5th
  [ScaleModeType.UkrainianDorian]: new ScaleModeInfo(
    ScaleModeType.UkrainianDorian,
    "ukrainian-dorian",
    SCALE_MODE_PATTERNS.UKRAINIAN_DORIAN,
    2,
  ), // Dorian with #4
  [ScaleModeType.PhrygianDominant]: new ScaleModeInfo(
    ScaleModeType.PhrygianDominant,
    "phrygian-dominant",
    SCALE_MODE_PATTERNS.PHRYGIAN_DOMINANT,
    5,
  ),
  [ScaleModeType.DoubleHarmonicMajor]: new ScaleModeInfo(
    ScaleModeType.DoubleHarmonicMajor,
    "double-harmonic-major",
    SCALE_MODE_PATTERNS.DOUBLE_HARMONIC_MAJOR,
    3,
  ),
  [ScaleModeType.PanthuVaraali]: new ScaleModeInfo(
    ScaleModeType.PanthuVaraali,
    "panthu-varaali",
    SCALE_MODE_PATTERNS.PANTHU_VARAALI,
    3,
  ), // Panthu Varaali
  [ScaleModeType.HarmonicMinor]: new ScaleModeInfo(
    ScaleModeType.HarmonicMinor,
    "harmonic-minor",
    SCALE_MODE_PATTERNS.HARMONIC_MINOR,
    1,
  ), // Harmonic minor scale
  [ScaleModeType.HungarianMinor]: new ScaleModeInfo(
    ScaleModeType.HungarianMinor,
    "hungarian-minor",
    SCALE_MODE_PATTERNS.HUNGARIAN_MINOR,
    6,
  ), // Hungarian minor scale
  [ScaleModeType.HarmonicMajor]: new ScaleModeInfo(
    ScaleModeType.HarmonicMajor,
    "harmonic-major",
    SCALE_MODE_PATTERNS.HARMONIC_MAJOR,
    1,
  ),
  [ScaleModeType.MixolydianB2]: new ScaleModeInfo(
    ScaleModeType.MixolydianB2,
    "mixolydian-b2",
    SCALE_MODE_PATTERNS.MIXOLYDIAN_B2,
    5,
  ),
  [ScaleModeType.MelodicMinor]: new ScaleModeInfo(
    ScaleModeType.MelodicMinor,
    "melodic-minor",
    SCALE_MODE_PATTERNS.MELODIC_MINOR,
    1,
  ), // Melodic minor (ascending form)
};

export const SCALE_SLUG_MAP = buildSlugMap(SCALE_MODE_REGISTRY);
