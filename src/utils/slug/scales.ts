import { ScaleModeType } from "@/types/enums/ScaleModeType";

import { createSlugCodec } from "./slugCodec";

export const SCALE_SLUG_MAP: Record<string, ScaleModeType> = {
  ionian: ScaleModeType.Ionian,
  dorian: ScaleModeType.Dorian,
  phrygian: ScaleModeType.Phrygian,
  byzantine: ScaleModeType.Byzantine,
  lydian: ScaleModeType.Lydian,
  mixolydian: ScaleModeType.Mixolydian,
  aeolian: ScaleModeType.Aeolian,
  locrian: ScaleModeType.Locrian,

  "ukrainian-dorian": ScaleModeType.UkrainianDorian,
  "phrygian-dominant": ScaleModeType.PhrygianDominant,
  "harmonic-minor": ScaleModeType.HarmonicMinor,
  "hungarian-minor": ScaleModeType.HungarianMinor,
  aroha: ScaleModeType.Aroha,
};

const scaleSlugCodec = createSlugCodec(SCALE_SLUG_MAP);

export const slugToScaleType = scaleSlugCodec.slugToValue;
export const scaleTypeToSlug = scaleSlugCodec.valueToSlug;
