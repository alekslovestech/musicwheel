export interface CartesianPoint {
  x: number;
  y: number;
}

export interface CartesianPointPair {
  start: CartesianPoint; //also flat
  end: CartesianPoint; //also sharp
}

/** SVG `points` attribute format for `<polygon>`/`<polyline>`: "x1,y1 x2,y2 ...". */
export function toSvgPointsString(points: CartesianPoint[]): string {
  return points.map((p) => `${p.x},${p.y}`).join(" ");
}
