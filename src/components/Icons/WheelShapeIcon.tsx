import { CircularVisMode } from "@/types/enums/SettingModes";
import { ixActual, toNoteIndices } from "@/types/IndexTypes";
import { toSvgPointsString } from "@/types/interfaces/CartesianPoint";
import {
  circularVisModeForNoteCount,
  NoteIndexVisualizer,
} from "@/utils/Keyboard/Circular/NoteIndexVisualizer";

const WHEEL_ICON_CENTER = 12;
const WHEEL_ICON_RADIUS = 9;
const WHEEL_ICON_DOT_RADIUS = 1.25;

interface WheelShapeIconProps {
  indices: number[];
  dotIndex?: number;
}

/**
 * A faint circle (the wheel) plus a shape drawn by the exact same {@link NoteIndexVisualizer}
 * class the Circular Keyboard itself uses to render a real note selection
 * ({@link CircularVisualizations.draw}) - so a playback-mode icon reads as "this is what lights
 * up on the wheel," not an arbitrary glyph. Mode follows the same count-based convention the
 * live wheel uses ({@link circularVisModeForNoteCount}): 2 indices draw an interval's spokes,
 * 3+ close into a chord shape. Radial mode's raw output (center, point, center, point, ...)
 * feeds a `<polyline>` directly: it retraces the first spoke on the way back through center,
 * which just overlaps invisibly.
 */
export function WheelShapeIcon({ indices, dotIndex }: WheelShapeIconProps) {
  const mode = circularVisModeForNoteCount(indices.length);
  const visualizer = new NoteIndexVisualizer(WHEEL_ICON_RADIUS, {
    x: WHEEL_ICON_CENTER,
    y: WHEEL_ICON_CENTER,
  });
  const shapePoints = toSvgPointsString(visualizer.getVisualization(toNoteIndices(indices), mode));
  const dot =
    dotIndex !== undefined ? visualizer.getCartesianFromIndex(ixActual(dotIndex)) : undefined;
  const shapeStyle = {
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinejoin: "round" as const,
    strokeLinecap: "round" as const,
  };

  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
      <circle
        cx={WHEEL_ICON_CENTER}
        cy={WHEEL_ICON_CENTER}
        r={WHEEL_ICON_RADIUS}
        stroke="currentColor"
        strokeWidth="1"
        strokeOpacity="0.5"
      />
      {mode === CircularVisMode.Polygon ? (
        <polygon points={shapePoints} {...shapeStyle} />
      ) : (
        <polyline points={shapePoints} {...shapeStyle} />
      )}
      {dot && <circle cx={dot.x} cy={dot.y} r={WHEEL_ICON_DOT_RADIUS} fill="currentColor" />}
    </svg>
  );
}
