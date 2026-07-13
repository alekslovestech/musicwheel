import { ScalePlaybackMode } from "@/types/enums/ScalePlaybackMode";

import { advanceScaleSequenceStep } from "@/utils/SequencePlaybackUtils";
import { StaffUtils } from "@/utils/StaffUtils";
import { GreekTestConstants } from "@/tests/utils/GreekTestConstants";

describe("advanceScaleSequenceStep", () => {
  const constants = GreekTestConstants.getInstance();

  test("walks scale degrees then plays final octave tonic", () => {
    const key = constants.C_PHRYGIAN_KEY;
    const length = key.scalePatternLength;

    for (let i = 0; i < length; i++) {
      const result = advanceScaleSequenceStep(key, i, ScalePlaybackMode.SingleNote);
      expect(result?.nextStepIndex).toBe(i + 1);
      expect(result?.step.notesToPlay.length).toBeGreaterThan(0);
    }

    const final = advanceScaleSequenceStep(key, length, ScalePlaybackMode.SingleNote);
    expect(final).not.toBeNull();
    expect(final?.nextStepIndex).toBeUndefined();
    expect(final?.step.notesToPlay.length).toBe(1);

    expect(advanceScaleSequenceStep(key, length + 1, ScalePlaybackMode.SingleNote)).toBeNull();
  });

  test("final octave tonic matches staff octave step for SingleNote", () => {
    const key = constants.C_IONIAN_KEY;
    const length = key.scalePatternLength;
    const final = advanceScaleSequenceStep(key, length, ScalePlaybackMode.SingleNote)!;

    expect(final.step.notesToPlay.length).toBe(1);

    const staffStepIndex = StaffUtils.findScaleStepIndexForSelection(
      key,
      ScalePlaybackMode.SingleNote,
      final.step.notesToPlay,
    );
    expect(staffStepIndex).toBe(length);
  });

  test("tonic degree in drone mode is a single note (no unison doubling)", () => {
    const key = constants.C_IONIAN_KEY;
    const tonicStep = advanceScaleSequenceStep(key, 0, ScalePlaybackMode.DronedSingleNote)!;
    expect(tonicStep.step.notesToPlay).toEqual([0]);
  });

  test("final drone step is lower tonic drone plus upper octave tonic", () => {
    const key = constants.C_IONIAN_KEY;
    const length = key.scalePatternLength;
    const final = advanceScaleSequenceStep(key, length, ScalePlaybackMode.DronedSingleNote)!;

    expect(final.step.notesToPlay).toEqual([0, 12]);

    const staffStepIndex = StaffUtils.findScaleStepIndexForSelection(
      key,
      ScalePlaybackMode.DronedSingleNote,
      final.step.notesToPlay,
    );
    expect(staffStepIndex).toBe(length);
  });
});
