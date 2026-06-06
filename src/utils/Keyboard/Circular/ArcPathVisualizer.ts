import { PolarMath } from "./PolarMath";

import { ChromaticIndex } from "@/types/ChromaticIndex";
import { TWELVE } from "@/types/constants/NoteConstants";
import { CartesianPoint, CartesianPointPair } from "@/types/interfaces/CartesianPoint";

const ACCIDENTAL_SYMBOL_STYLES = {
  radialOffset: 0.85, //(0=inner, 1=outer)
  angleCoefficient: 0.7, //how far from the edges of the pie slice to place the accidental (anglular coordinates)
} as const;

/** Fraction of slice chord width available for roman label text at the label radius. */
const ROMAN_LABEL_WIDTH_FRACTION = 0.85;
/** Labels with more than this many characters get width/height fitting (see getRomanLabelFit). */
const ROMAN_LABEL_FIT_MAX_DEFAULT_LENGTH = 4;
/** Base label height as a fraction of radial wedge depth (SVG user units). */
const ROMAN_LABEL_BASE_FONT_HEIGHT_FRACTION = 0.35;
/** Smallest height scale applied when compressing long roman labels. */
const ROMAN_LABEL_MIN_HEIGHT_SCALE = 0.6;
/** Reference character count for full-height roman labels when fitting. */
const ROMAN_LABEL_REFERENCE_LENGTH = 4;

export class ArcPathVisualizer {
  public static getTextPoint(
    chromaticIndex: ChromaticIndex,
    outerRadius: number,
    innerRadius: number,
  ): CartesianPoint {
    const middleAngle = PolarMath.NoteIndexToMiddleAngle(chromaticIndex);
    return PolarMath.getCartesianFromPolar((innerRadius + outerRadius) * 0.5, middleAngle);
  }

  /** SVG user-unit width for {@link SVGTextElement.textLength} on roman triad labels. */
  public static getRomanLabelTextLength(outerRadius: number, innerRadius: number): number {
    const textRadius = (innerRadius + outerRadius) * 0.5;
    const sliceAngle = (2 * Math.PI) / TWELVE;
    const chordWidth = 2 * textRadius * Math.sin(sliceAngle / 2);
    return chordWidth * ROMAN_LABEL_WIDTH_FRACTION;
  }

  /**
   * Width/height fit for long roman triad labels. Width uses {@link SVGTextElement.textLength};
   * height scales down proportionally so glyphs are not tall and narrow.
   */
  public static getRomanLabelFit(
    label: string,
    outerRadius: number,
    innerRadius: number,
  ): { textLength: number; fontSize: number } | undefined {
    if (label.length <= ROMAN_LABEL_FIT_MAX_DEFAULT_LENGTH) return undefined;

    const textLength = this.getRomanLabelTextLength(outerRadius, innerRadius);
    const wedgeDepth = outerRadius - innerRadius;
    const baseFontSize = wedgeDepth * ROMAN_LABEL_BASE_FONT_HEIGHT_FRACTION;
    const heightScale = Math.max(
      ROMAN_LABEL_MIN_HEIGHT_SCALE,
      ROMAN_LABEL_REFERENCE_LENGTH / label.length,
    );

    return {
      textLength,
      fontSize: baseFontSize * heightScale,
    };
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
