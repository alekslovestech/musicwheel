import type chroma from "chroma-js";

import type { MusicalKey } from "@/types/Keys/MusicalKey";
import { ScalePlaybackMode } from "@/types/enums/ScalePlaybackMode";
import { toNoteIndices } from "@/types/IndexTypes";
import { getScaleStepAtSequenceIndex } from "@/utils/SequencePlaybackUtils";
import { ColorUtils } from "@/utils/visual/ColorUtils";

/**
 * Color of a scale-sequence step, derived from the notes that actually sound at
 * that step — single note, interval, or chord alike. This is the same derivation
 * the circular keyboard uses ({@link ColorUtils.getColorForIndices}), so the
 * wheel, staff, and ribbon all stay in visual lockstep across playback modes.
 *
 * `stepIndex` runs `0..scalePatternLength`, where `scalePatternLength` is the
 * final octave tonic; out-of-range indices fall back to the neutral color.
 */
export function noteHighlightColor(
  key: MusicalKey,
  scalePlaybackMode: ScalePlaybackMode,
  stepIndex: number,
): chroma.Color {
  if (stepIndex < 0 || stepIndex > key.scalePatternLength) {
    return ColorUtils.getColorForIndices(toNoteIndices([]));
  }

  const { notesToPlay } = getScaleStepAtSequenceIndex(key, stepIndex, scalePlaybackMode);
  return ColorUtils.getColorForIndices(notesToPlay);
}
