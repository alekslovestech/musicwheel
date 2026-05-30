import { TWELVE } from "@/types/constants/NoteConstants";
import { ChromaticIndex, ixChromatic } from "@/types/ChromaticIndex";

import { ColorUtils } from "@/utils/visual/ColorUtils";
import { PolarMath } from "@/utils/Keyboard/Circular/PolarMath";
import { CartesianPoint, CartesianPointPair } from "@/types/interfaces/CartesianPoint";

import { useMusical } from "@/contexts/MusicalContext";

import { CIRCLE_RADIUS, useKeyboardHandlers } from "../KeyboardBase";

import { CircularVisualizations } from "./CircularVisualizations";
import { PianoKeyCircular } from "./PianoKeyCircular";
import { CircularVisMode } from "@/types/SettingModes";
import { useIsScalePreviewMode } from "@/lib/hooks/useGlobalMode";
import { chromaticToActual } from "@/types/IndexTypes";

const MAX_RADIUS = 100;
const OUTER_RADIUS = 0.9 * MAX_RADIUS;
const INNER_RADIUS = 0.5 * MAX_RADIUS;

export const KeyboardCircular = () => {
  const { handleKeyClick, checkIsBassNote } = useKeyboardHandlers();
  const { selectedNoteIndices, selectedMusicalKey } = useMusical();
  //const { circularVisMode } = useDisplay();
  const numNotes = selectedNoteIndices.length;
  const circularVisMode =
    numNotes > 2
      ? CircularVisMode.Polygon
      : numNotes === 2
        ? CircularVisMode.Radial
        : CircularVisMode.None;
  const isScales = useIsScalePreviewMode();

  const SCALE_BOUNDARY_EXTENT = OUTER_RADIUS + CIRCLE_RADIUS * 2;
  const VIEWPORT_RADIUS = Math.max(SCALE_BOUNDARY_EXTENT, MAX_RADIUS);
  const coords = [-VIEWPORT_RADIUS, -VIEWPORT_RADIUS, VIEWPORT_RADIUS * 2, VIEWPORT_RADIUS * 2];
  const chordColor = ColorUtils.getColorForIndices(selectedNoteIndices);

  const getLineCartesianPoints = (
    tonicIndex: ChromaticIndex,
    innerRadius: number,
    outerRadius: number,
  ): CartesianPointPair => {
    const COEFF = 1.05;
    const { startAngle: startOfTonicAngle } = PolarMath.NoteIndexToAngleRange(tonicIndex);
    const start: CartesianPoint = PolarMath.getCartesianFromPolar(
      innerRadius / COEFF,
      startOfTonicAngle,
      true,
    );

    const end: CartesianPoint = PolarMath.getCartesianFromPolar(
      outerRadius * COEFF,
      startOfTonicAngle,
      true,
    );

    return { start, end };
  };

  const renderScaleBoundary = () => {
    if (!isScales) return null;
    const line = getLineCartesianPoints(
      selectedMusicalKey.tonicIndex,
      INNER_RADIUS,
      OUTER_RADIUS * 0.95,
    );

    const { startAngle: startOfTonicAngle } = PolarMath.NoteIndexToAngleRange(
      selectedMusicalKey.tonicIndex,
    );
    const point_end_circle = PolarMath.getCartesianFromPolar(
      OUTER_RADIUS + CIRCLE_RADIUS,
      startOfTonicAngle,
      true,
    );

    return [
      <g className="stroke-keys-scaleBoundaryColor stroke-2" key="scale-boundrary-circular">
        <line x1={line.start.x} y1={line.start.y} x2={line.end.x} y2={line.end.y} />
        <circle cx={point_end_circle.x} cy={point_end_circle.y} r={CIRCLE_RADIUS} fill="none" />
      </g>,
    ];
  };

  return (
    <svg
      viewBox={coords.join(" ")}
      className="flex w-full max-w-[800px] h-full aspect-square p-[5px] justify-center items-center [container-type:inline-size]"
    >
      {Array.from({ length: TWELVE }).map((_, index) => {
        const chromaticIndex = ixChromatic(index);
        const actualIndex = chromaticToActual(chromaticIndex); // Need to convert for checkIsRootNote
        const isBassNote = checkIsBassNote(actualIndex);

        return (
          <PianoKeyCircular
            key={index}
            chromaticIndex={chromaticIndex}
            isBassNote={isBassNote} // Rename prop
            onClick={handleKeyClick}
            outerRadius={OUTER_RADIUS}
            innerRadius={INNER_RADIUS}
          />
        );
      })}
      {CircularVisualizations.draw(
        selectedNoteIndices,
        circularVisMode,
        INNER_RADIUS,
        chordColor.css(),
      )}
      {renderScaleBoundary()}
    </svg>
  );
};
