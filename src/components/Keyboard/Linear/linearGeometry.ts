import { ChromaticIndex } from "@/types/ChromaticIndex";
import { BLACK_KEY_WIDTH_RATIO, WHITE_KEYS_PER_OCTAVE } from "@/types/constants/NoteConstants";
import { toSvgPointsString } from "@/types/interfaces/CartesianPoint";
import { BlackKeyUtils } from "@/utils/BlackKeyUtils";
import { LinearKeyboardUtils } from "@/utils/Keyboard/Linear/LinearKeyboardUtils";

// Scale-boundary marker: a flag marking the tonic, echoing the circular keyboard's tonic marker
//  A fixed-size polygon, not scaled with the
// keyboard's height, since it lives in the page's unscaled margin above it.
export const SCALE_BOUNDARY_FLAG_WIDTH = 10; // px, back edge to tip
export const SCALE_BOUNDARY_FLAG_HEIGHT = 8; // px, protrusion above the keyboard
const SCALE_BOUNDARY_FLAG_BASE_WIDTH = 2; // px, width of the back edge

export const SCALE_BOUNDARY_FLAG_VIEWBOX = `0 0 ${SCALE_BOUNDARY_FLAG_WIDTH} ${SCALE_BOUNDARY_FLAG_HEIGHT}`;

// Perimeter walk: up the flush back edge, out to the tip, down to the other corner of the back
// edge (a sliver of width, not a point, so it reads as a flag rather than a bare triangle).
export const SCALE_BOUNDARY_FLAG_POINTS = toSvgPointsString([
  { x: 0, y: SCALE_BOUNDARY_FLAG_HEIGHT },
  { x: 0, y: 0 },
  { x: SCALE_BOUNDARY_FLAG_WIDTH, y: SCALE_BOUNDARY_FLAG_HEIGHT / 2 },
  { x: SCALE_BOUNDARY_FLAG_BASE_WIDTH, y: SCALE_BOUNDARY_FLAG_HEIGHT },
]);

/**
 * Left-edge x-position (percent of keyboard width) of the tonic's white-key column, one entry per
 * octave shown - compact shows the tonic once, the default 2-octave view twice, so the flag
 * appears once to the left of each tonic. Black-key tonics are nudged left by half a black-key
 * width so the flag lines up with the key's own left edge instead of the white-key boundary
 * underneath it, matching how PianoKeyLinear centers a black key over that same boundary.
 */
export function getScaleBoundaryLeftPercentages(
  tonicIndex: ChromaticIndex,
  isCompact: boolean,
): number[] {
  const denominator = isCompact ? WHITE_KEYS_PER_OCTAVE + 1 : WHITE_KEYS_PER_OCTAVE * 2;
  const octaveOffsets = isCompact ? [0] : [0, WHITE_KEYS_PER_OCTAVE];
  const position = LinearKeyboardUtils.whiteKeyPositions[tonicIndex];
  const shortKeyOffset = BlackKeyUtils.isBlackKey(tonicIndex)
    ? -((BLACK_KEY_WIDTH_RATIO * 100) / denominator / 2)
    : 0;

  return octaveOffsets.map(
    (octaveOffset) => ((position + octaveOffset) / denominator) * 100 + shortKeyOffset,
  );
}
