import { TWELVE } from "@/types/constants/NoteConstants";
import { ActualIndex, ixActual, NoteIndices } from "@/types/IndexTypes";
import { KeyboardUIType } from "@/types/enums/KeyboardUIType";
import { ScalePlaybackMode } from "@/types/enums/ScalePlaybackMode";
import { MusicalKey } from "@/types/Keys/MusicalKey";
import { KeyboardUtils } from "@/utils/Keyboard/KeyboardUtils";
import { circularVisModeForNoteCount } from "@/utils/Keyboard/Circular/NoteIndexVisualizer";
import { ColorUtils } from "@/utils/visual/ColorUtils";

import { CircularVisualizations } from "./CircularVisualizations";
import { PianoKeyCircular } from "./PianoKeyCircular";
import {
  CIRCULAR_VIEWBOX,
  INNER_RADIUS,
  OUTER_RADIUS,
  getScaleBoundaryPoints,
} from "./circularGeometry";

/**
 * The circular keyboard's one rendering implementation: the 12 keys, the step-interval arcs, the
 * chord highlight, and the tonic flag. KeyboardCircular (the live app) is a thin adapter that
 * reads context and forwards it here; Learn figures call this directly with plain data instead of
 * hooks. Passing null for onKeyClick is what makes a call site read-only - an omission, not a
 * flag - so a static page can be trusted not to ship interactivity from the prop alone.
 */
export function CircularKeyboardView({
  musicalKey,
  highlightedNoteIndices = [],
  scalePlaybackMode = ScalePlaybackMode.SingleNote,
  showStepAnnotations = false,
  isScales = true,
  onKeyClick,
  isBassNote = () => false,
  className = "w-full aspect-square",
}: {
  musicalKey: MusicalKey;
  highlightedNoteIndices?: NoteIndices;
  scalePlaybackMode?: ScalePlaybackMode;
  /** Colors the arc between each pair of adjacent scale degrees by its whole/half-step size - the
   * same annotation the live wheel's W-H toggle adds. For figures illustrating a scale's own
   * shape rather than highlighting one degree against a drone. */
  showStepAnnotations?: boolean;
  /** Scales-mode shading (diatonic vs. muted, plus the tonic flag) vs. Harmony-mode shading (a
   * plain chromatic keyboard, only selected notes colored) - the same distinction the live app
   * draws between its two modes. Chord figures with no scale context want this off. */
  isScales?: boolean;
  /** Pass null for a read-only wheel. The live app passes its real click handler here. */
  onKeyClick: ((index: ActualIndex) => void) | null;
  isBassNote?: (index: ActualIndex) => boolean;
  className?: string;
}) {
  const highlightColor = ColorUtils.getColorForIndices(highlightedNoteIndices);

  return (
    <svg
      viewBox={CIRCULAR_VIEWBOX}
      className={className}
      role={onKeyClick == null ? "img" : undefined}
    >
      {Array.from({ length: TWELVE }).map((_, index) => {
        const actualIndex = ixActual(index);

        return (
          <PianoKeyCircular
            key={index}
            actualIndex={actualIndex}
            isBassNote={isBassNote(actualIndex)}
            onKeyClick={onKeyClick}
            outerRadius={OUTER_RADIUS}
            innerRadius={INNER_RADIUS}
            isSelected={KeyboardUtils.isKeySelected(
              actualIndex,
              highlightedNoteIndices,
              KeyboardUIType.Circular,
            )}
            isScales={isScales}
            selectedMusicalKey={musicalKey}
            scalePlaybackMode={scalePlaybackMode}
          />
        );
      })}
      {showStepAnnotations &&
        CircularVisualizations.drawScaleStepIntervals(musicalKey, INNER_RADIUS)}
      {CircularVisualizations.draw(
        highlightedNoteIndices,
        circularVisModeForNoteCount(highlightedNoteIndices.length),
        INNER_RADIUS,
        highlightColor.css(),
      )}
      {isScales && (
        <polygon
          points={getScaleBoundaryPoints(musicalKey.tonicIndex)}
          className="fill-keys-scaleBoundaryColor"
          stroke="none"
        />
      )}
    </svg>
  );
}
