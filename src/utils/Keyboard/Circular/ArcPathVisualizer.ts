import { PolarMath } from "./PolarMath";

import { ChromaticIndex } from "@/types/ChromaticIndex";
import { TWELVE } from "@/types/constants/NoteConstants";
import { CartesianPoint, CartesianPointPair } from "@/types/interfaces/CartesianPoint";

const ACCIDENTAL_SYMBOL_STYLES = {
  radialOffset: 0.85, //(0=inner, 1=outer)
  angleCoefficient: 0.7, //how far from the edges of the pie slice to place the accidental (anglular coordinates)
} as const;

export class ArcPathVisualizer {
  public static getTextPoint(
    chromaticIndex: ChromaticIndex,
    outerRadius: number,
    innerRadius: number,
  ): CartesianPoint {
    const middleAngle = PolarMath.NoteIndexToMiddleAngle(chromaticIndex);
    return PolarMath.getCartesianFromPolar((innerRadius + outerRadius) * 0.5, middleAngle);
  }

  public static getAccidentalPositions(
    chromaticIndex: ChromaticIndex,
    outerRadius: number,
    innerRadius: number,
  ): CartesianPointPair {
    const HALF_KEY_ANGLE = (ACCIDENTAL_SYMBOL_STYLES.angleCoefficient * Math.PI) / TWELVE;
    const middleAngle = PolarMath.NoteIndexToMiddleAngle(chromaticIndex);
    const radius =
      innerRadius + (outerRadius - innerRadius) * ACCIDENTAL_SYMBOL_STYLES.radialOffset;

    return {
      start: PolarMath.getCartesianFromPolar(radius, middleAngle - HALF_KEY_ANGLE), //flat
      end: PolarMath.getCartesianFromPolar(radius, middleAngle + HALF_KEY_ANGLE), //sharp
    };
  }

  public static getArcPathData(
    chromaticIndex: ChromaticIndex,
    outerRadius: number,
    innerRadius: number,
  ): string {
    const [outerStart, outerEnd, innerEnd, innerStart] = this.getArcPoints(
      chromaticIndex,
      outerRadius,
      innerRadius,
    );

    // Create SVG path: move to outer start, arc to outer end, line to inner end, arc to inner start, close path
    return [
      `M ${outerStart.x} ${outerStart.y}`, // Move to start
      `A ${outerRadius} ${outerRadius} 0 0 1 ${outerEnd.x} ${outerEnd.y}`, // Outer arc
      `L ${innerEnd.x} ${innerEnd.y}`, // Line to inner
      `A ${innerRadius} ${innerRadius} 0 0 0 ${innerStart.x} ${innerStart.y}`, // Inner arc
      "Z", // Close path
    ].join(" ");
  }

  private static getArcPoints(
    chromaticIndex: ChromaticIndex,
    outerRadius: number,
    innerRadius: number,
  ): CartesianPoint[] {
    const { startAngle, endAngle } = PolarMath.NoteIndexToAngleRange(chromaticIndex);
    // Convert angles to cartesian coordinates
    const outerStart = PolarMath.getCartesianFromPolar(outerRadius, startAngle, true);
    const outerEnd = PolarMath.getCartesianFromPolar(outerRadius, endAngle, true);
    const innerStart = PolarMath.getCartesianFromPolar(innerRadius, startAngle, true);
    const innerEnd = PolarMath.getCartesianFromPolar(innerRadius, endAngle, true);

    return [outerStart, outerEnd, innerEnd, innerStart];
  }
}
