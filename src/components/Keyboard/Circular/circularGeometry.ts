import { ChromaticIndex } from "@/types/ChromaticIndex";
import { toSvgPointsString } from "@/types/interfaces/CartesianPoint";
import { PolarPoint } from "@/types/interfaces/PolarPoint";
import { PolarMath } from "@/utils/Keyboard/Circular/PolarMath";

const MAX_RADIUS = 100;
export const OUTER_RADIUS = 0.9 * MAX_RADIUS;
export const INNER_RADIUS = 0.5 * MAX_RADIUS;

export const SCALE_BOUNDARY_MARKER_SIZE = 5;

// Viewport: sized to fit the widest thing drawn, the scale-boundary marker.
const SCALE_BOUNDARY_EXTENT = OUTER_RADIUS + SCALE_BOUNDARY_MARKER_SIZE * 2;
const VIEWPORT_RADIUS = Math.max(SCALE_BOUNDARY_EXTENT, MAX_RADIUS);

export const CIRCULAR_VIEWBOX = [
  -VIEWPORT_RADIUS,
  -VIEWPORT_RADIUS,
  VIEWPORT_RADIUS * 2,
  VIEWPORT_RADIUS * 2,
].join(" ");

// Scale-boundary marker: a single flag-on-a-flagpole polygon marking the tonic. The pole runs
// from the inner key ring to the outer one; the flag - the clockwise-pointing tip, the direction
// the scale runs from its tonic - sits on top of it, past the outer ring. Its back edge (pole and
// flag both) is the straight radial line readers expect. One polygon rather than a stroked line
// plus a separately filled arrowhead, so there's no seam between two differently-rendered shapes
// to line up.
const SCALE_BOUNDARY_STRETCH = 1.05; // overshoots the inner key ring
const SCALE_BOUNDARY_INNER_RADIUS = INNER_RADIUS / SCALE_BOUNDARY_STRETCH;
const SCALE_BOUNDARY_MARKER_RADIUS = OUTER_RADIUS + SCALE_BOUNDARY_MARKER_SIZE;
const SCALE_BOUNDARY_FAR_RADIUS = SCALE_BOUNDARY_MARKER_RADIUS + SCALE_BOUNDARY_MARKER_SIZE;
const SCALE_BOUNDARY_TIP_ARC = 2 * SCALE_BOUNDARY_MARKER_SIZE; // clockwise offset of the tip
const SCALE_BOUNDARY_POLE_WIDTH = 2; // matches the old line's stroke width

// Perimeter walk as (radius, clockwise arc-length offset from the boundary line) pairs: up the
// flush back edge (pole then flag, collinear so together they're one straight edge), out to the
// tip, back down to where the flag meets the pole, then down the pole's offset front edge.
const SCALE_BOUNDARY_PERIMETER: [number, number][] = [
  [SCALE_BOUNDARY_INNER_RADIUS, 0],
  [SCALE_BOUNDARY_FAR_RADIUS, 0],
  [SCALE_BOUNDARY_MARKER_RADIUS, SCALE_BOUNDARY_TIP_ARC],
  [OUTER_RADIUS, SCALE_BOUNDARY_POLE_WIDTH],
  [SCALE_BOUNDARY_INNER_RADIUS, SCALE_BOUNDARY_POLE_WIDTH],
];

export function getScaleBoundaryPoints(tonicIndex: ChromaticIndex): string {
  const { startAngle } = PolarMath.NoteIndexToAngleRange(tonicIndex);

  const polarPoints: PolarPoint[] = SCALE_BOUNDARY_PERIMETER.map(([radius, arcOffset]) => ({
    r: radius,
    azimuth: startAngle + arcOffset / radius,
  }));

  // Rotated about the wheel's center rather than offset in a flat plane, so every corner lands
  // exactly on its arc instead of drifting outward by the error a linear approximation adds.
  const points = polarPoints.map((p) => PolarMath.getCartesianFromPolar(p, true));
  return toSvgPointsString(points);
}
