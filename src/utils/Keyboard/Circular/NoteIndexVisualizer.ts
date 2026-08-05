import { ChromaticIndex } from "@/types/ChromaticIndex";
import { ActualIndex, NoteIndices } from "@/types/IndexTypes";
import { CircularVisMode } from "@/types/enums/SettingModes";
import { CartesianPoint } from "@/types/interfaces/CartesianPoint";
import { PolarMath } from "./PolarMath";

/**
 * The convention followed wherever a note selection or a fixed icon picks its own mode: two
 * notes read as an interval (Radial - spokes forming an angle/wedge), three or more as a chord
 * (Polygon - a closed shape). Not universal: {@link CircularVisualizations.drawSegment}
 * deliberately passes `Polygon` for exactly 2 points to get a bare line segment, not to depict
 * a 2-note interval, and must keep choosing its mode explicitly rather than through this.
 */
export function circularVisModeForNoteCount(count: number): CircularVisMode {
  if (count > 2) return CircularVisMode.Polygon;
  if (count === 2) return CircularVisMode.Radial;
  return CircularVisMode.None;
}

export class NoteIndexVisualizer {
  constructor(
    private readonly radius: number,
    private readonly center: CartesianPoint = { x: 0, y: 0 },
  ) {}

  /**
   * Polygon maps each index to its wheel point, for a closed shape. Radial interleaves
   * center/point pairs per index, for spokes fed straight into a polyline.
   */
  getVisualization(indices: NoteIndices, mode: CircularVisMode): CartesianPoint[] {
    switch (mode) {
      case CircularVisMode.Radial:
        return indices.flatMap((index) => {
          const point = this.getCartesianFromIndex(index);
          return [this.center, point];
        });
      case CircularVisMode.Polygon:
        return indices.map((index) => this.getCartesianFromIndex(index));
      default:
        return [];
    }
  }

  /** The single-point primitive {@link getVisualization} maps every index through. */
  getCartesianFromIndex(index: ChromaticIndex | ActualIndex): CartesianPoint {
    const middleAngle = PolarMath.NoteIndexToMiddleAngle(index);
    const cartPoint = PolarMath.getCartesianFromPolar(this.radius, middleAngle, true);
    return { x: cartPoint.x + this.center.x, y: cartPoint.y + this.center.y };
  }
}
