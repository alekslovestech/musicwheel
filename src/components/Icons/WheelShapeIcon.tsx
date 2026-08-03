import { CircularVisMode } from "@/types/enums/SettingModes";
import { toNoteIndices } from "@/types/IndexTypes";
import { NoteIndexVisualizer } from "@/utils/Keyboard/Circular/NoteIndexVisualizer";

const WHEEL_ICON_CENTER = 12;
const WHEEL_ICON_RADIUS = 9;
const WHEEL_ICON_DOT_RADIUS = 1.25;

interface WheelShapeIconProps {
  /** Wheel positions the shape connects, e.g. [0,4,8] for a triangle or [0,4] for an interval. */
  indices: number[];
  /** Polygon closes into a shape (a triad/seventh); Radial draws spokes from the center (an interval). */
  mode: CircularVisMode.Polygon | CircularVisMode.Radial;
  /** Which of {@link indices} gets a filled marker dot, e.g. the tonic - default none. */
  dotIndex?: number;
}

/**
 * A faint circle (the wheel) plus a shape drawn by the exact same {@link NoteIndexVisualizer}
 * class and mode the Circular Keyboard itself uses to render a real note selection
 * ({@link CircularVisualizations.draw}) - so a playback-mode icon reads as "this is what lights
 * up on the wheel," not an arbitrary glyph. Used for both chords (Polygon, 3+ indices) and
 * intervals (Radial, 2 indices) - same shape, just different indices/mode from the caller.
 * Radial mode's raw output (center, point, center, point, ...) feeds a `<polyline>` directly:
 * it retraces the first spoke on the way back through center, which just overlaps invisibly.
 */
export function WheelShapeIcon({ indices, mode, dotIndex }: WheelShapeIconProps) {
  const visualizer = new NoteIndexVisualizer(WHEEL_ICON_RADIUS, {
    x: WHEEL_ICON_CENTER,
    y: WHEEL_ICON_CENTER,
  });
  const shapePoints = visualizer
    .getVisualization(toNoteIndices(indices), mode)
    .map((p) => `${p.x},${p.y}`)
    .join(" ");
  const dot =
    dotIndex !== undefined
      ? visualizer.getVisualization(toNoteIndices([dotIndex]), CircularVisMode.Polygon)[0]
      : undefined;
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
