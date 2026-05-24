import { PROGRESSION_SLUG_MAP } from "@/types/ChordProgressions/progressionRegistry";

import { createSlugCodec } from "./slugCodec";

const progressionSlugCodec = createSlugCodec(PROGRESSION_SLUG_MAP);

export const slugToProgressionType = progressionSlugCodec.slugToValue;
export const progressionTypeToSlug = progressionSlugCodec.valueToSlug;
