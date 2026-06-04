import { PROGRESSION_SLUG_MAP } from "@/types/ChordProgressions/progressionRegistry";
import { SCALE_SLUG_MAP } from "@/types/ScaleModes/ScaleModeRegistry";

import { createSlugCodec } from "./slugCodec";

const scaleSlugCodec = createSlugCodec(SCALE_SLUG_MAP);
const progressionSlugCodec = createSlugCodec(PROGRESSION_SLUG_MAP);

export const slugToScaleType = scaleSlugCodec.slugToValue;
export const scaleTypeToSlug = scaleSlugCodec.valueToSlug;
export const slugToProgressionType = progressionSlugCodec.slugToValue;
export const progressionTypeToSlug = progressionSlugCodec.valueToSlug;
