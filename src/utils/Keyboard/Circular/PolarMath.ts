import { ChromaticIndex } from "@/types/ChromaticIndex";
import { ActualIndex } from "@/types/IndexTypes";
import { TWELVE } from "@/types/constants/NoteConstants";
import { CartesianPoint } from "@/types/interfaces/CartesianPoint";
import { PolarPoint } from "@/types/interfaces/PolarPoint";

const TWO_PI = 2 * Math.PI;

// Azimuth convention for every angle in this module (and everything downstream of it): 0 points
// straight up, positive rotates clockwise. That's the opposite sense from the underlying cos/sin
// math, which measures counterclockwise from the +x axis - AZIMUTH_TO_MATH_ANGLE is the one place
// that gap gets bridged, so callers never need to think about it.
const AZIMUTH_TO_MATH_ANGLE = -Math.PI / 2;

const FULL_KEY_ANGLE = TWO_PI / TWELVE;
const HALF_KEY_ANGLE = FULL_KEY_ANGLE / 2;

export class PolarMath {
  static getCartesianFromPolar(point: PolarPoint, isRounded?: boolean): CartesianPoint;
  static getCartesianFromPolar(
    radius: number,
    azimuth: number,
    isRounded?: boolean,
  ): CartesianPoint;
  static getCartesianFromPolar(
    radiusOrPoint: number | PolarPoint,
    azimuthOrIsRounded?: number | boolean,
    isRoundedArg: boolean = false,
  ): CartesianPoint {
    const [point, isRounded]: [PolarPoint, boolean] =
      typeof radiusOrPoint === "number"
        ? [{ r: radiusOrPoint, azimuth: azimuthOrIsRounded as number }, isRoundedArg]
        : [radiusOrPoint, (azimuthOrIsRounded as boolean) ?? false];

    const mathAngle = AZIMUTH_TO_MATH_ANGLE + point.azimuth;
    const x = point.r * Math.cos(mathAngle);
    const y = point.r * Math.sin(mathAngle);
    if (!isRounded) return { x, y };
    return { x: Math.round(x * 100) / 100, y: Math.round(y * 100) / 100 };
  }

  static NoteIndexToMiddleAngle(index: ChromaticIndex | ActualIndex): number {
    return index * FULL_KEY_ANGLE + HALF_KEY_ANGLE;
  }

  static NoteIndexToAngleRange(index: ChromaticIndex | ActualIndex) {
    const startAngle = index * FULL_KEY_ANGLE;
    const endAngle = startAngle + FULL_KEY_ANGLE;
    return { startAngle, endAngle };
  }
}
