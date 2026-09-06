import { TWELVE } from "@/types/constants/NoteConstants";
import { ixActual } from "@/types/IndexTypes";
import { KeyboardUIType } from "@/types/enums/KeyboardUIType";
import { KeyboardUtils } from "@/utils/Keyboard/KeyboardUtils";

import { ColorUtils } from "@/utils/visual/ColorUtils";

import { useMusical } from "@/contexts/MusicalContext";

import { useKeyboardHandlers } from "../KeyboardBase";

import { CircularVisualizations } from "./CircularVisualizations";
import { PianoKeyCircular } from "./PianoKeyCircular";
import {
  CIRCULAR_VIEWBOX,
  INNER_RADIUS,
  OUTER_RADIUS,
  getScaleBoundaryPoints,
} from "./circularGeometry";
import { circularVisModeForNoteCount } from "@/utils/Keyboard/Circular/NoteIndexVisualizer";
import { showsStepSegments } from "@/utils/visual/scaleRibbonUtils";
import { useIsScalePreviewMode } from "@/lib/hooks/useGlobalMode";
import { useAudio } from "@/contexts/AudioContext";
import { useDisplay } from "@/contexts/DisplayContext";

export const KeyboardCircular = () => {
  const { onCircularKeyClick, checkIsBassNote } = useKeyboardHandlers();
  const { selectedNoteIndices, selectedMusicalKey } = useMusical();
  const circularVisMode = circularVisModeForNoteCount(selectedNoteIndices.length);
  const isScales = useIsScalePreviewMode();
  const { scalePlaybackMode } = useAudio();
  const { showStepAnnotations } = useDisplay();
  const showScaleStepIntervals =
    isScales && showsStepSegments(scalePlaybackMode, showStepAnnotations);

  const chordColor = ColorUtils.getColorForIndices(selectedNoteIndices);

  const renderScaleBoundary = () => {
    if (!isScales) return null;

    return (
      <polygon
        id="scale-boundary-marker"
        points={getScaleBoundaryPoints(selectedMusicalKey.tonicIndex)}
        className="fill-keys-scaleBoundaryColor"
        stroke="none"
      />
    );
  };

  return (
    <svg
      viewBox={CIRCULAR_VIEWBOX}
      className="flex w-full max-w-[800px] h-full aspect-square p-[5px] justify-center items-center [container-type:inline-size]"
    >
      {Array.from({ length: TWELVE }).map((_, index) => {
        const actualIndex = ixActual(index);
        const isBassNote = checkIsBassNote(actualIndex);

        return (
          <PianoKeyCircular
            key={index}
            actualIndex={actualIndex}
            isBassNote={isBassNote}
            onKeyClick={onCircularKeyClick}
            outerRadius={OUTER_RADIUS}
            innerRadius={INNER_RADIUS}
            isSelected={KeyboardUtils.isKeySelected(
              actualIndex,
              selectedNoteIndices,
              KeyboardUIType.Circular,
            )}
            isScales={isScales}
            selectedMusicalKey={selectedMusicalKey}
            scalePlaybackMode={scalePlaybackMode}
          />
        );
      })}
      {showScaleStepIntervals &&
        CircularVisualizations.drawScaleStepIntervals(selectedMusicalKey, INNER_RADIUS)}
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
