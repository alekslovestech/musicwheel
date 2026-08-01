import { ScalePlaybackMode } from "@/types/enums/ScalePlaybackMode";
import { StaffUtils } from "@/utils/StaffUtils";
import { GreekTestConstants } from "@/tests/utils/GreekTestConstants";

describe("StaffUtils.scaleStaffHighlightColor", () => {
  const key = GreekTestConstants.getInstance().C_IONIAN_KEY;

  test("single-note mode uses neutral gray for every step", () => {
    const neutral = StaffUtils.scaleStaffHighlightColor(
      key,
      ScalePlaybackMode.SingleNote,
      0,
    );
    expect(
      StaffUtils.scaleStaffHighlightColor(key, ScalePlaybackMode.SingleNote, 3),
    ).toBe(neutral);
  });

  test("drone mode uses interval colors for non-tonic degrees", () => {
    const tonic = StaffUtils.scaleStaffHighlightColor(
      key,
      ScalePlaybackMode.DronedSingleNote,
      0,
    );
    const third = StaffUtils.scaleStaffHighlightColor(
      key,
      ScalePlaybackMode.DronedSingleNote,
      2,
    );

    expect(third).not.toBe(tonic);
  });
});
