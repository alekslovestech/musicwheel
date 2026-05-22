import { ScaleModeType } from "@/types/enums/ScaleModeType";

import { createSlugCodec } from "./slugCodec";

const SCALE_SLUG_MAP: Record<string, ScaleModeType> = {
  ionian: ScaleModeType.Ionian,
  dorian: ScaleModeType.Dorian,
  "ukrainian-dorian": ScaleModeType.UkrainianDorian,
  phrygian: ScaleModeType.Phrygian,
  "phrygian-dominant": ScaleModeType.PhrygianDominant,
  byzantine: ScaleModeType.Byzantine,
  lydian: ScaleModeType.Lydian,
  mixolydian: ScaleModeType.Mixolydian,
  aeolian: ScaleModeType.Aeolian,
  "harmonic-minor": ScaleModeType.HarmonicMinor,
  "hungarian-minor": ScaleModeType.HungarianMinor,
  locrian: ScaleModeType.Locrian,
};

const scaleSlugCodec = createSlugCodec(SCALE_SLUG_MAP, "ionian");

export const DEFAULT_SCALE_SLUG = scaleSlugCodec.defaultSlug;
export const slugToScaleType = scaleSlugCodec.slugToValue;
export const scaleTypeToSlug = scaleSlugCodec.valueToSlug;
