import {
  isChordalScalePlaybackMode,
  SCALE_PLAYBACK_MODE_CAPTIONS,
  ScalePlaybackMode,
} from "@/types/enums/ScalePlaybackMode";

describe("ScalePlaybackMode", () => {
  test("Triad and Seventh are the chordal modes; the rest are not", () => {
    expect(isChordalScalePlaybackMode(ScalePlaybackMode.Triad)).toBe(true);
    expect(isChordalScalePlaybackMode(ScalePlaybackMode.Seventh)).toBe(true);
    expect(isChordalScalePlaybackMode(ScalePlaybackMode.SingleNote)).toBe(false);
    expect(isChordalScalePlaybackMode(ScalePlaybackMode.DronedSingleNote)).toBe(false);
  });

  test("Triad and Seventh share a caption - they differ only in chord density", () => {
    expect(SCALE_PLAYBACK_MODE_CAPTIONS[ScalePlaybackMode.Triad]).toBe(
      SCALE_PLAYBACK_MODE_CAPTIONS[ScalePlaybackMode.Seventh],
    );
  });
});
