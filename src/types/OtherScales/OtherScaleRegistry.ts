import { OtherScaleType } from "@/types/enums/OtherScaleType";
import { buildSlugMap } from "@/utils/slug/slugCodec";

import { OtherScaleInfo } from "./OtherScaleInfo";

export const OTHER_SCALE_REGISTRY: Record<OtherScaleType, OtherScaleInfo> = {
  [OtherScaleType.WholeTone]: new OtherScaleInfo(OtherScaleType.WholeTone, "Whole Tone", "whole-tone", [
    0, 2, 4, 6, 8, 10,
  ]),
  [OtherScaleType.Diminished]: new OtherScaleInfo(
    OtherScaleType.Diminished,
    "Diminished",
    "diminished",
    [0, 2, 3, 5, 6, 8, 9, 11],
  ),
  [OtherScaleType.MajorPentatonic]: new OtherScaleInfo(
    OtherScaleType.MajorPentatonic,
    "Major Pentatonic",
    "major-pentatonic",
    [0, 2, 4, 7, 9],
  ),
  [OtherScaleType.MinorPentatonic]: new OtherScaleInfo(
    OtherScaleType.MinorPentatonic,
    "Minor Pentatonic",
    "minor-pentatonic",
    [0, 3, 5, 7, 10],
  ),  
};

export const OTHER_SCALE_SLUG_MAP = buildSlugMap(OTHER_SCALE_REGISTRY);
