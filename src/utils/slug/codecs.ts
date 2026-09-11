import { PROGRESSION_SLUG_MAP } from "@/types/ChordProgressions/progressionRegistry";
import { SCALE_SLUG_MAP } from "@/types/ScaleModes/ScaleModeRegistry";
import { OTHER_SCALE_SLUG_MAP } from "@/types/OtherScales/OtherScaleRegistry";
import { ChordProgressionType } from "@/types/enums/ChordProgressionType";
import { ScaleModeType } from "@/types/enums/ScaleModeType";
import { OtherScaleType } from "@/types/enums/OtherScaleType";

import { slugToValue, valueToSlug } from "./slugCodec";

export const slugToScaleType = (slug: string) => slugToValue(SCALE_SLUG_MAP, slug);
export const scaleTypeToSlug = (type: ScaleModeType | null) => valueToSlug(SCALE_SLUG_MAP, type);
export const slugToOtherScaleType = (slug: string) => slugToValue(OTHER_SCALE_SLUG_MAP, slug);
export const otherScaleTypeToSlug = (type: OtherScaleType | null) =>
  valueToSlug(OTHER_SCALE_SLUG_MAP, type);
export const slugToProgressionType = (slug: string) => slugToValue(PROGRESSION_SLUG_MAP, slug);
export const progressionTypeToSlug = (type: ChordProgressionType | null) =>
  valueToSlug(PROGRESSION_SLUG_MAP, type);
