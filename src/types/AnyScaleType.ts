import { OtherScaleType } from "@/types/enums/OtherScaleType";
import { ScaleModeType } from "@/types/enums/ScaleModeType";

/** A scale selectable in the Scales view - diatonic (ScaleModeType) or not (OtherScaleType). */
export type AnyScaleType = ScaleModeType | OtherScaleType;

export function isOtherScaleType(scaleMode: AnyScaleType): scaleMode is OtherScaleType {
  return Object.values(OtherScaleType).includes(scaleMode as OtherScaleType);
}
