import { TWELVE } from "@/types/constants/NoteConstants";
import { ixActual, NoteIndices } from "@/types/IndexTypes";
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
 * The wheel with every moving part removed: no click handlers, no audio, no context reads - the
 * key, the highlight and the playback mode all arrive as props. Prose pages render this so a
 * figure's colors and geometry come from the same code the live app runs, instead of from a
 * captured image that silently goes stale the next time the palette or the layout moves.
 */
export function StaticKeyboardCircular({
  musicalKey,
  highlightedNoteIndices = [],
  scalePlaybackMode = ScalePlaybackMode.SingleNote,
  showStepAnnotations = false,
  isScales = true,
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
}) {
  const highlightColor = ColorUtils.getColorForIndices(highlightedNoteIndices);

  return (
    <svg viewBox={CIRCULAR_VIEWBOX} className="w-full aspect-square" role="img">
      {Array.from({ length: TWELVE }).map((_, index) => {
        const actualIndex = ixActual(index);

        return (
          <PianoKeyCircular
            key={index}
            actualIndex={actualIndex}
            isBassNote={false}
            onKeyClick={null}
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
