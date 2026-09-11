import { OtherScaleType } from "@/types/enums/OtherScaleType";
import { buildSlugMap } from "@/utils/slug/slugCodec";

import { OtherScaleInfo } from "./OtherScaleInfo";

export const OTHER_SCALE_REGISTRY: Record<OtherScaleType, OtherScaleInfo> = {
  [OtherScaleType.WholeTone]: new OtherScaleInfo(OtherScaleType.WholeTone, "Whole Tone", "whole-tone", [
    0, 2, 4, 6, 8, 10,
  ]),
};

export const OTHER_SCALE_SLUG_MAP = buildSlugMap(OTHER_SCALE_REGISTRY);
