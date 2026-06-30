import { ScalePlaybackMode } from "@/types/enums/ScalePlaybackMode";

import {
  advanceScaleSequenceStep,
  ScaleSequenceStepKind,
} from "@/utils/SequencePlaybackUtils";
import { GreekTestConstants } from "@/tests/utils/GreekTestConstants";

describe("advanceScaleSequenceStep", () => {
  const constants = GreekTestConstants.getInstance();

  test("walks scale degrees then plays final octave tonic", () => {
    const key = constants.C_PHRYGIAN_KEY;
    const length = key.scalePatternLength;

    for (let i = 0; i < length; i++) {
      const result = advanceScaleSequenceStep(key, i, ScalePlaybackMode.SingleNote);
      expect(result.kind).toBe(ScaleSequenceStepKind.Play);
      if (result.kind === ScaleSequenceStepKind.Play) {
        expect(result.nextStepIndex).toBe(i + 1);
        expect(result.step.notesToPlay.length).toBeGreaterThan(0);
      }
    }

    const final = advanceScaleSequenceStep(key, length, ScalePlaybackMode.SingleNote);
    expect(final.kind).toBe(ScaleSequenceStepKind.PlayFinal);
    if (final.kind === ScaleSequenceStepKind.PlayFinal) {
      expect(final.step.notesToPlay.length).toBe(1);
    }

    expect(advanceScaleSequenceStep(key, length + 1, ScalePlaybackMode.SingleNote)).toEqual({
      kind: ScaleSequenceStepKind.Idle,
    });
  });
});
