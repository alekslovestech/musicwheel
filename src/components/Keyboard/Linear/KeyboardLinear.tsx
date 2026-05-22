import { useRef } from "react";

import { TWENTY4 } from "@/types/constants/NoteConstants";
import { ActualIndex } from "@/types/IndexTypes";
import { LinearKeyboardUtils } from "@/utils/Keyboard/Linear/LinearKeyboardUtils";
import { useIsScalePreviewMode } from "@/lib/hooks/useGlobalMode";
import { useLinearKeyboardDoDisplayText } from "@/lib/hooks/useLinearKeyboardDoDisplayText";

import { useKeyboardHandlers } from "@/components/Keyboard/KeyboardBase";
import { PianoKeyLinear } from "@/components/Keyboard/Linear/PianoKeyLinear";
import { useMusical } from "@/contexts/MusicalContext";

export const KeyboardLinear = () => {
  const { handleKeyClick, checkIsBassNote } = useKeyboardHandlers();
  const { selectedMusicalKey } = useMusical();
  const containerRef = useRef<HTMLDivElement>(null);
  const doDisplayText = useLinearKeyboardDoDisplayText(containerRef);

  const isScales = useIsScalePreviewMode();
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const renderScaleBoundary = () => {
    if (!isScales) return null;

    const { x1, x2 } = LinearKeyboardUtils.calculateScaleBoundaryPercentages(
      selectedMusicalKey.tonicIndex,
    );

    const startY = 90;
    const endY = 100;
    const circleCenterY = 105;
    // Create a vertical line at the tonic position - in both scales
    return (
      <svg viewBox="0 -10 100 110" preserveAspectRatio="none">
        <line
          className="scale-boundary linear"
          key="scale-boundrary-left"
          x1={x1}
          y1={startY}
          x2={x1}
          y2={endY}
          vectorEffect="non-scaling-stroke"
        />
        <line
          className="scale-boundary linear"
          key="scale-boundrary-right"
          x1={x2}
          y1={startY}
          x2={x2}
          y2={endY}
          vectorEffect="non-scaling-stroke"
        />
        <circle
          key="scale-boundrary-left-circle"
          cx={x1}
          cy={circleCenterY}
          r={3}
          fill="none"
          stroke="black"
          vectorEffect="non-scaling-stroke"
        />
        <circle
          key="scale-boundrary-right-circle"
          cx={x2}
          cy={circleCenterY}
          r={3}
          fill="none"
          stroke="black"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    );
  };

  const keys = [];
  for (let actualIndex = 0 as ActualIndex; actualIndex < TWENTY4; actualIndex++) {
    //TODO: consider highlighting the ROOT note for the linear keyboard, and the BASS note for the circular keyboard
    //complication: that might be confusing for the user, and it's less important on the linear keyboard.
    const isBassNote = checkIsBassNote(actualIndex);

    keys.push(
      <PianoKeyLinear
        key={actualIndex}
        actualIndex={actualIndex}
        isBassNote={isBassNote}
        doDisplayText={doDisplayText}
        onClick={handleKeyClick}
      />,
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative flex box-border w-full max-h-full aspect-[4/1] p-[5px]"
    >
      {/*renderScaleBoundary()}*/}
      <div className="relative w-full h-full">{keys}</div>
    </div>
  );
};
